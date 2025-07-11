// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StreamMall is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct Content {
        uint256 id;
        string title;
        string description;
        string category;
        string contentUrl;
        string thumbnailUrl;
        uint256 pricePerMinute; // in wei
        uint256 duration; // in minutes
        address creator;
        bool isActive;
        uint256 totalViews;
        uint256 totalEarnings;
        string[] tags;
    }

    struct Stream {
        uint256 id;
        uint256 contentId;
        address buyer;
        address seller;
        uint256 startTime;
        uint256 endTime;
        uint256 totalMinutes;
        uint256 totalCost;
        bool isActive;
        uint256 lastPaymentTime;
    }

    struct User {
        address walletAddress;
        string username;
        string email;
        bool isCreator;
        uint256 totalEarnings;
        uint256 totalSpent;
        uint256[] contentIds;
        uint256[] streamIds;
    }

    // State variables
    uint256 private contentCounter;
    uint256 private streamCounter;
    uint256 private constant PLATFORM_FEE = 250; // 2.5% platform fee
    uint256 private constant FEE_DENOMINATOR = 10000;

    mapping(uint256 => Content) public contents;
    mapping(uint256 => Stream) public streams;
    mapping(address => User) public users;
    mapping(address => uint256[]) public userStreams;
    mapping(address => uint256[]) public creatorContent;
    mapping(uint256 => address[]) public contentStreamers;

    // Events
    event ContentCreated(uint256 indexed contentId, address indexed creator, string title, uint256 pricePerMinute);
    event StreamStarted(uint256 indexed streamId, uint256 indexed contentId, address indexed buyer, address seller);
    event StreamEnded(uint256 indexed streamId, uint256 totalCost, uint256 totalMinutes);
    event PaymentProcessed(uint256 indexed streamId, address indexed buyer, address indexed seller, uint256 amount);
    event UserRegistered(address indexed user, string username, bool isCreator);
    event ContentUpdated(uint256 indexed contentId, string title, uint256 pricePerMinute);

    constructor() {}

    // User Management
    function registerUser(string memory _username, string memory _email, bool _isCreator) external {
        require(bytes(users[msg.sender].username).length == 0, "User already registered");
        
        users[msg.sender] = User({
            walletAddress: msg.sender,
            username: _username,
            email: _email,
            isCreator: _isCreator,
            totalEarnings: 0,
            totalSpent: 0,
            contentIds: new uint256[](0),
            streamIds: new uint256[](0)
        });

        emit UserRegistered(msg.sender, _username, _isCreator);
    }

    // Content Management
    function createContent(
        string memory _title,
        string memory _description,
        string memory _category,
        string memory _contentUrl,
        string memory _thumbnailUrl,
        uint256 _pricePerMinute,
        uint256 _duration,
        string[] memory _tags
    ) external {
        require(bytes(users[msg.sender].username).length > 0, "User not registered");
        require(users[msg.sender].isCreator, "Only creators can create content");
        require(_pricePerMinute > 0, "Price must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");

        contentCounter++;
        uint256 newContentId = contentCounter;

        contents[newContentId] = Content({
            id: newContentId,
            title: _title,
            description: _description,
            category: _category,
            contentUrl: _contentUrl,
            thumbnailUrl: _thumbnailUrl,
            pricePerMinute: _pricePerMinute,
            duration: _duration,
            creator: msg.sender,
            isActive: true,
            totalViews: 0,
            totalEarnings: 0,
            tags: _tags
        });

        users[msg.sender].contentIds.push(newContentId);
        creatorContent[msg.sender].push(newContentId);

        emit ContentCreated(newContentId, msg.sender, _title, _pricePerMinute);
    }

    function updateContent(
        uint256 _contentId,
        string memory _title,
        string memory _description,
        uint256 _pricePerMinute,
        bool _isActive
    ) external {
        require(contents[_contentId].creator == msg.sender, "Only creator can update content");
        require(_pricePerMinute > 0, "Price must be greater than 0");

        contents[_contentId].title = _title;
        contents[_contentId].description = _description;
        contents[_contentId].pricePerMinute = _pricePerMinute;
        contents[_contentId].isActive = _isActive;

        emit ContentUpdated(_contentId, _title, _pricePerMinute);
    }

    // Streaming Functions
    function startStream(uint256 _contentId) external payable nonReentrant {
        require(contents[_contentId].isActive, "Content not active");
        require(contents[_contentId].creator != msg.sender, "Cannot stream own content");
        require(bytes(users[msg.sender].username).length > 0, "User not registered");
        
        // Check if user has any active streams for this content
        uint256[] memory userStreamIds = userStreams[msg.sender];
        for (uint256 i = 0; i < userStreamIds.length; i++) {
            require(!streams[userStreamIds[i]].isActive || streams[userStreamIds[i]].contentId != _contentId, 
                    "Already streaming this content");
        }

        // Require minimum payment for 1 minute
        uint256 minimumPayment = contents[_contentId].pricePerMinute;
        require(msg.value >= minimumPayment, "Insufficient payment for minimum streaming time");

        streamCounter++;
        uint256 newStreamId = streamCounter;

        streams[newStreamId] = Stream({
            id: newStreamId,
            contentId: _contentId,
            buyer: msg.sender,
            seller: contents[_contentId].creator,
            startTime: block.timestamp,
            endTime: 0,
            totalMinutes: 0,
            totalCost: 0,
            isActive: true,
            lastPaymentTime: block.timestamp
        });

        users[msg.sender].streamIds.push(newStreamId);
        userStreams[msg.sender].push(newStreamId);
        contentStreamers[_contentId].push(msg.sender);
        
        // Update content views
        contents[_contentId].totalViews++;

        emit StreamStarted(newStreamId, _contentId, msg.sender, contents[_contentId].creator);
    }

    function endStream(uint256 _streamId) external nonReentrant {
        require(streams[_streamId].buyer == msg.sender, "Only buyer can end stream");
        require(streams[_streamId].isActive, "Stream not active");

        Stream storage stream = streams[_streamId];
        Content storage content = contents[stream.contentId];

        // Calculate total streaming time and cost
        uint256 totalTime = block.timestamp.sub(stream.startTime);
        uint256 totalMinutes = totalTime.div(60);
        uint256 totalCost = totalMinutes.mul(content.pricePerMinute);

        // End the stream
        stream.endTime = block.timestamp;
        stream.totalMinutes = totalMinutes;
        stream.totalCost = totalCost;
        stream.isActive = false;

        // Process payment
        _processPayment(stream.seller, totalCost);

        // Update statistics
        content.totalEarnings = content.totalEarnings.add(totalCost);
        users[stream.seller].totalEarnings = users[stream.seller].totalEarnings.add(totalCost);
        users[stream.buyer].totalSpent = users[stream.buyer].totalSpent.add(totalCost);

        emit StreamEnded(_streamId, totalCost, totalMinutes);
    }

    function _processPayment(address _seller, uint256 _amount) internal {
        if (_amount > 0) {
            uint256 platformFee = _amount.mul(PLATFORM_FEE).div(FEE_DENOMINATOR);
            uint256 sellerAmount = _amount.sub(platformFee);

            // Transfer to seller
            (bool success, ) = _seller.call{value: sellerAmount}("");
            require(success, "Payment to seller failed");

            // Platform fee stays in contract
            emit PaymentProcessed(streamCounter, msg.sender, _seller, sellerAmount);
        }
    }

    // View Functions
    function getContent(uint256 _contentId) external view returns (Content memory) {
        return contents[_contentId];
    }

    function getStream(uint256 _streamId) external view returns (Stream memory) {
        return streams[_streamId];
    }

    function getUser(address _userAddress) external view returns (User memory) {
        return users[_userAddress];
    }

    function getUserStreams(address _userAddress) external view returns (uint256[] memory) {
        return userStreams[_userAddress];
    }

    function getCreatorContent(address _creator) external view returns (uint256[] memory) {
        return creatorContent[_creator];
    }

    function getActiveStreams(address _userAddress) external view returns (uint256[] memory) {
        uint256[] memory userStreamIds = userStreams[_userAddress];
        uint256[] memory activeStreams = new uint256[](userStreamIds.length);
        uint256 activeCount = 0;

        for (uint256 i = 0; i < userStreamIds.length; i++) {
            if (streams[userStreamIds[i]].isActive) {
                activeStreams[activeCount] = userStreamIds[i];
                activeCount++;
            }
        }

        // Resize array
        uint256[] memory result = new uint256[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeStreams[i];
        }

        return result;
    }

    function getAllActiveContent() external view returns (uint256[] memory) {
        uint256[] memory activeContent = new uint256[](contentCounter);
        uint256 activeCount = 0;

        for (uint256 i = 1; i <= contentCounter; i++) {
            if (contents[i].isActive) {
                activeContent[activeCount] = i;
                activeCount++;
            }
        }

        // Resize array
        uint256[] memory result = new uint256[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeContent[i];
        }

        return result;
    }

    function getContentCount() external view returns (uint256) {
        return contentCounter;
    }

    function getStreamCount() external view returns (uint256) {
        return streamCounter;
    }

    // Admin Functions
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%");
        // Implementation would update the fee
    }

    // Emergency Functions
    function emergencyEndStream(uint256 _streamId) external onlyOwner {
        require(streams[_streamId].isActive, "Stream not active");
        
        Stream storage stream = streams[_streamId];
        stream.isActive = false;
        stream.endTime = block.timestamp;
        
        // Calculate and process payment
        uint256 totalTime = block.timestamp.sub(stream.startTime);
        uint256 totalMinutes = totalTime.div(60);
        uint256 totalCost = totalMinutes.mul(contents[stream.contentId].pricePerMinute);
        
        stream.totalMinutes = totalMinutes;
        stream.totalCost = totalCost;
        
        _processPayment(stream.seller, totalCost);
    }

    // Fallback function to receive ETH
    receive() external payable {}
}