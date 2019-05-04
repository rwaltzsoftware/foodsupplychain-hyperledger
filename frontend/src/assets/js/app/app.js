	var globIcoAddress = {
		
		'FoodSupplyChain': "0x575547236605bbd20e80ed1ec221952bc38a0ca1",
		'SupplyChainUser': "0x7a63bd04eb2f3df19c09b260006279b9585d794d",
		'FoodSupplyChainShipingLogistic': "0xe7eedccb0d4dd9d6f2f6a1e1a85cf7fedf796e0c"
	};

	var globAdminAddress = 0xab0874cB61D83F6B67Dc08141568868102233bef;
	var globMainContract = false;
	var globSubContract = false;
	var globUserContract = false;
	var globCoinbase = false;	
	var globUserData = [];
	var foodSupplyChainAbi = {};
	var foodSupplyChainShipingLogisticAbi = {};
	var supplyChainUserAbi = {};


	window.addEventListener('load', function() 
	{  
		$("#logisticContractAddress").html(globIcoAddress.FoodSupplyChainShipingLogistic);
		$("#foodSupplychainContractAddress").html(globIcoAddress.FoodSupplyChain);
		$("#supplyChainUserAddress").html(globIcoAddress.SupplyChainUser);

		$("#logisticContractAddress").attr('title',globIcoAddress.FoodSupplyChainShipingLogistic);
		$("#foodSupplychainContractAddress").attr('title',globIcoAddress.FoodSupplyChain);
		$("#supplyChainUserAddress").attr('title',globIcoAddress.SupplyChainUser);

		if (typeof web3 !== 'undefined') 
		{
		  web3 = new Web3(web3.currentProvider);
		  // web3 = new Web3("https://rinkeby.infura.io/8U0AE4DUGSh8lVO3zmma");
		} else {
		  // set the provider you want from Web3.providers
		  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		}
		
		getCurrentAccountAddress((address)=>{
			/*  To Restrict User in Admin Section */
			var currentPath = window.location.pathname;
			var tmpStack = currentPath.split("/");
			var currentPanel = tmpStack.pop();

			if(currentPanel == "admin.php")
			{
				// if(address != globAdminAddress){
				// 	window.location = "index.php";
				// }
			}
		});

		Promise.all([
			$.getJSON(globalContractAbiUrl.FoodSupplyChain),
			$.getJSON(globalContractAbiUrl.FoodSupplyChainShipingLogistic),
			$.getJSON(globalContractAbiUrl.SupplyChainUser)
		])
		.then(([foodSupplyChainAbi,
				foodSupplyChainShipingLogisticAbi,
				supplyChainUserAbi])=>{
			globMainContract = 	initContract(foodSupplyChainAbi.abi,globIcoAddress.FoodSupplyChain);
			$(window).trigger("mainContractReady");

			globSubContract = 	initContract(foodSupplyChainShipingLogisticAbi.abi,globIcoAddress.FoodSupplyChainShipingLogistic);
			$(window).trigger("subContractReady");

			globUserContract = 	initContract(supplyChainUserAbi.abi,globIcoAddress.SupplyChainUser);
			$(window).trigger("userContractReady");

		});


		updateLoginAccountStatus();
		/* setInterval(function () {
			updateLoginAccountStatus();
		}, 500); */
		
	});

	function initContract(abi,contractAddress)
	{
		return new web3.eth.Contract(abi,contractAddress);
	}

	function updateLoginAccountStatus(){

		web3.eth.getAccounts(function(err,accounts){

			if(err){
				console.log('An error occurred '+ err);
			}else if(accounts.length == 0){
				sweetAlert('Error', 'Please login to MetaMask..!', 'error');
				$("#currentUserAddress").html("0x0000000000000000000000000000000000000000");
			}else{
				initAccountDetails();
			}
		});
	}

	function initAccountDetails(){
		/*
		* Get Current wallet account address
		*/
		getCurrentAccountAddress((address)=>{
			globCoinbase = address;	
			$("#currentUserAddress").html(globCoinbase);	
			$("#currentUserAddress").attr('title',globCoinbase);
			$(window).trigger("coinbaseReady");		
		});
	}


	function getCurrentAccountAddress(callback){
		callback = callback || false;

		web3.eth.getCoinbase()
		.then((_coinbase)=>{
			callback(_coinbase);
		})
		.catch((err)=>{
			if(callback){
				callback(0);
			}
		})
	}

	function getUserDetails(contractRef,userAddress,callback){
		callback = callback || false;

		contractRef.methods.getUser(userAddress).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get User Details","error");
			callback(0);
		});
	}

	function getCultivationData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}

		callback = callback || false;

		contractRef.methods.getBasicDetails(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Cultivation Details","error");
			callback(0);
		});
	}

	function getFarmInspectorData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}


		callback = callback || false;

		contractRef.methods.getFarmInspectorData(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Farm Inspection Details","error");
			callback(0);
		});
	}

	function getProducerData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}


		callback = callback || false;

		contractRef.methods.getProducerData(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Producer Details","error");
			callback(0);
		});
	}

	function getExporterData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}

		callback = callback || false;

		contractRef.methods.getExporterData(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Exporting Details","error");
			callback(0);
		});
	}

	function getCarrierData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}


		callback = callback || false;

		contractRef.methods.getCarrierData(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Carrier Details","error");
			callback(0);
		});
	}

	function getDistributorData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}

		callback = callback || false;

		contractRef.methods.getDistributorData(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Distributor Details","error");
			callback(0);
		});
	}

	function getProcessorData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}

		callback = callback || false;

		contractRef.methods.getProcessorData(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Processing Details","error");
			callback(0);
		});
	}

	function getRetailerData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}

		callback = callback || false;

		contractRef.methods.getRetailerData(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Retailer Details","error");
			callback(0);
		});
	}

	function getUserEvents(contractRef)
	{
	    contractRef.getPastEvents('UserUpdate',{
	        fromBlock: 0 
	    }).then(function (events){

	        $("#tblUser").DataTable().destroy();
	        $("#tblUser tbody").html(buildUserDetails(events));
	        $("#tblUser").DataTable({
	        	"displayLength": 3,
	        	"order": [[ 1, "asc" ]]
	        });
	    }).catch((err)=>{
	    	console.log(err);
	    });
	}

	function buildUserDetails(events){
		
		var filteredUser = {};
		var isNewUser = false;

		/*filtering latest updated user record*/
		$(events).each(function(index,event){

			if(filteredUser[event.returnValues.user] == undefined)
			{
				filteredUser[event.returnValues.user] = {};
				filteredUser[event.returnValues.user].address = event.address;
				filteredUser[event.returnValues.user].role = event.returnValues.role;
				filteredUser[event.returnValues.user].user = event.returnValues.user;
				filteredUser[event.returnValues.user].name = event.returnValues.name;
				filteredUser[event.returnValues.user].contactNo = event.returnValues.contactNo;
				filteredUser[event.returnValues.user].profileHash = event.returnValues.profileHash;
				filteredUser[event.returnValues.user].blockNumber = event.blockNumber;
			}
			else if(filteredUser[event.returnValues.user].blockNumber < event.blockNumber)
			{
				filteredUser[event.returnValues.user].address = event.address;
				filteredUser[event.returnValues.user].role = event.returnValues.role;
				filteredUser[event.returnValues.user].user = event.returnValues.user;
				filteredUser[event.returnValues.user].name = event.returnValues.name;
				filteredUser[event.returnValues.user].contactNo = event.returnValues.contactNo;
				filteredUser[event.returnValues.user].profileHash = event.returnValues.profileHash;
				filteredUser[event.returnValues.user].blockNumber = event.blockNumber;
			}
		});

		var builtUser = [];
		for(tmpUser in filteredUser)
		{
			builtUser.push(filteredUser[tmpUser]);
		}

		/*build user Table*/
		$("#totalUsers").html(builtUser.length);
		return buildUserTable(builtUser);
	}

	function buildUserTable(globUserData){

		var tbody = "";
		var roleClass = "";

		$(globUserData).each(function(index,data){

			var role = data.role;	

			if(role == 'FARM_INSPECTION'){
				roleClass = "info";
			}else if(role == 'PRODUCER'){
				roleClass = "success";
			}else if(role == 'EXPORTER'){
				roleClass = "warning";
			}else if(role == 'CARRIER'){
				roleClass = "primary";
			}else if(role == 'DISTRIBUTOR'){
				roleClass = "facebook";
			}else if(role == 'PROCESSOR'){
				roleClass = "default";
			}else if(role == 'RETAILER'){
				roleClass = "youtube";
			}	

			tbody += `<tr>
	                        <td><center><img style="width:20%;" src="https://ipfs.io/ipfs/`+data.profileHash+`"/></center></td>
	                        <td>`+data.user+`</td>
	                        <td>`+data.name+`</td>
	                        <td>`+data.contactNo+`</td>
	                        <td> <button type="button" class="btn btn-`+roleClass+` btn-circle" title="`+role+`">
                                    <i class="fa fa-user"></i> 
                                </button>
                            </td>
	                        <td><a href="javascript:void(0);" class="text-inverse p-r-10" data-toggle="tooltip" data-userAddress="`+data.user+`" onclick="openEditUser(this);" title="Edit"><i class="ti-marker-alt"></i></a> </td>
	                  </tr>`;
		});	

		return tbody;
	}

	function handleTransactionResponse(txHash,finalMessage)
	{
		var txLink = "https://rinkeby.etherscan.io/tx/" + txHash ;
	    var txLinkHref = "<a target='_blank' href='"+txLink+"'> Click here for Transaction Status </a>" ;

	    sweetAlert("Success", "Please Check Transaction Status here :  "+txLinkHref, "success");

	    $("#linkOngoingTransaction").html(txLinkHref);
	    $("#divOngoingTransaction").fadeIn();
	    /*scroll to top*/
	    $('html, body').animate({ scrollTop: 0 }, 'slow', function () {});
	}

	function handleTransactionReceipt(receipt,finalMessage)
	{
		$("#linkOngoingTransaction").html("");
	    $("#divOngoingTransaction").fadeOut();

	    // sweetAlert("Success", "Token Purchase Complete ", "success");
	    sweetAlert("Success", finalMessage, "success");
	    window.location.reload();
	}

	function handleGenericError(error_message)
	{
	    if(error_message.includes("MetaMask Tx Signature"))
	    {
	        sweetAlert("Error", "Transaction Refused ", "error");
	    }
	    else
	    {
	        // sweetAlert("Error", "Error Occured, Please Try Again , if problem persist get in touch with us. ", "error");
	        sweetAlert("Error", error_message, "error");
	    }

	}


	function changeSwitchery(element, checked) {
	  if ( ( element.is(':checked') && checked == false ) || ( !element.is(':checked') && checked == true ) ) {
	    element.parent().find('.switchery').trigger('click');
	  }
	}

	/*==================================Bootstrap Model Start=========================================*/

	function startLoader(){
		$(".preloader").fadeIn();
	}

	function stopLoader(){
		$(".preloader").fadeOut();
	}

	/*Set Default inactive*/
    $("#userFormClick").click(function(){
        $("#userForm").trigger('reset');
        changeSwitchery($("#isActive"),false);
        $("#userModelTitle").html("Add User");
        $("#imageHash").html('');
        $("#userFormModel").modal();    
    });

    /*Edit User Model Form*/
    function openEditUser(ref){
		var userAddress = $(ref).attr("data-userAddress");
		startLoader();
		getUserDetails(globUserContract,userAddress,function(result){
			$("#userWalletAddress").val(userAddress);
			$("#userName").val(result.name);
			$("#userContactNo").val(result.contactNo);
			$("#userProfileHash").val(result.profileHash);
			$('#userRoles').val(result.role).prop('selected', true);

			var profileImageLink = 'https://ipfs.io/ipfs/'+result.profileHash;

			var btnViewImage = '<br/><img src="'+profileImageLink+'" style="width:20%;"><br/>';
			$("#imageHash").html(btnViewImage);

			changeSwitchery($("#isActive"),result.isActive);
			$("#userModelTitle").html("Update User");
			stopLoader();
			$("#userFormModel").modal();
		});
	}

	// ipfs = window.IpfsApi('localhost', 5001);
	ipfs = window.IpfsApi('ipfs.infura.io', '5001', {protocol: 'https'})

	function handleFileUpload(event){
		const file = event.target.files[0];

	    let reader = new window.FileReader();
	    reader.onloadend = function () {
	       $("#userFormBtn").prop('disabled',true);
	       $("i.fa-spinner").show();
	        $("#imageHash").html('Processing......');	
	       saveToIpfs(reader)
	    }

	    reader.readAsArrayBuffer(file)
	}

	function saveToIpfs(reader){
		let ipfsId;

        const Buffer = window.IpfsApi().Buffer;
        const buffer = Buffer.from(reader.result);

        /*Upload Buffer to IPFS*/
        ipfs.files.add(buffer, (err, result) => { 
	        if (err) {
		          console.error(err)
		          return
			}
			
			var imageHash = result[0].hash;		

			var profileImageLink = 'https://ipfs.io/ipfs/'+imageHash;
			var btnViewImage = '<a href="'+profileImageLink+'" target="_blank" class=" text-danger"><i class="fa fa-eye"></i> View Image</a>';

	        $("#userProfileHash").val(imageHash);
	        $("#imageHash").html(btnViewImage);
	        
	        $("#userFormBtn").prop('disabled',false);
	        $("i.fa-spinner").hide();	
	    });
	}

function viewBatchDetail(ref,process_name){
    var batchNo = $(ref).attr('data-batch_no');
    var verified_seal_html = `<div class="form-group">
                                <img src="plugins/images/verified.jpg" alt="user-img" style="width:80px;height:80px" class="img-circle pull-right">
                            </div>`;
    var html = '';                        
    if(process_name=="CULTIVATION"){
        getCultivationData(globMainContract,batchNo,function(result)
        {
            $("#batchTitle").html("Basic Details");
            html = `<div class="form-group">
                            <b>Registration No:</b> `+result.registrationNo+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Food Name:</b> `+result.foodName+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Farmer Name:</b> `+result.farmerName+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Farm Address:</b> `+result.farmAddress+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Carrier Name:</b> `+result.carrierName+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        `+verified_seal_html;  

            $("#informationFields").html(html);                                  
        });
    }else if(process_name=="FARM_INSPECTION"){
        getFarmInspectorData(globMainContract,batchNo,function(result)
        {
            $("#batchTitle").html("Farm Inspection Details");
            html = `<div class="form-group">
                            <b>Soil Type:</b> `+result.soilType+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Type of Seed:</b> `+result.typeOfSeed+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Fertilizer Used:</b> `+result.fertilizerUsed+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Process Name:</b> `+result.processName+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Certificate Number:</b> `+result.certificateNumber+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        `+verified_seal_html;  

            $("#informationFields").html(html);                                  
        });
    }else if(process_name=="PRODUCER"){
        getProducerData(globMainContract,batchNo,function(result)
        {
            $("#batchTitle").html("Producer Details");
            html = `<div class="form-group">
                            <b>Crop Veriety:</b> `+result.cropVariety+` <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Temperature Used:</b> `+result.temperatureUsed+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Humidity:</b> `+result.humidity+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        `+verified_seal_html;  

            $("#informationFields").html(html);  
        });    
    }else if(process_name=="EXPORTER"){
        getExporterData(globSubContract,batchNo,function(result)
        {
           $("#batchTitle").html("Exporter Details");
            html = `<div class="form-group">
                            <b>Export Details:</b> `+result.exporterDetail+` <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Package Details:</b> `+result.packageDetail+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Destination Address:</b> `+result.destinationAddress+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Ship ID:</b> `+result.shipID+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Quantity:</b> `+result.quantity+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Loading Date & Time:</b> `+toDate(result.loadingDateTime)+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        `+verified_seal_html;  

            $("#informationFields").html(html);  
        });    
    }else if(process_name=="CARRIER"){
        getCarrierData(globSubContract,batchNo,function(result)
        {
            $("#batchTitle").html("Carrier Details");
            html = `<div class="form-group">
                            <b>Carrier Name:</b> `+result.carrierName+` <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Carrier No:</b> `+result.carrierNo+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Shipment ID:</b> `+result.shipmentID+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Maintained Temperature:</b> `+result.maintainedTemperature+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Maintained Humidity:</b> `+result.maintainedHumidity+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Shipment Date & Time:</b> `+toDate(result.shipmentDateTime)+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        `+verified_seal_html;  

            $("#informationFields").html(html); 
        });    
    }else if(process_name=="DISTRIBUTOR"){
        getDistributorData(globSubContract,batchNo,function(result)
        {
            $("#batchTitle").html("Distributor Details");
            html = `<div class="form-group">
                            <b>Certificate ID:</b> `+result.certificateID+` <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Warehouse Name:</b> `+result.warehouseName+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Warehouse Address:</b> `+result.warehouseAddress+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Storage Temperature:</b> `+result.storageTemperature+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Storage Humidity:</b> `+result.storageHumidity+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Packaging Details:</b> `+result.packagingDetail+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Quantity:</b> `+result.quantity+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        `+verified_seal_html;  

            $("#informationFields").html(html);
        });    
    }else if(process_name=="PROCESSOR"){
        getProcessorData(globSubContract,batchNo,function(result)
        {
            $("#batchTitle").html("Processor Details");
            html = `<div class="form-group">
                            <b>Processor Name:</b> `+result.processorName+` <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Temperature:</b> `+result.temperature+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Internal Batch No:</b> `+result.internalBatchNo+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Package Name:</b> `+result.packageName+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Package Address:</b> `+result.packageAddress+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Processing Date & Time:</b> `+toDate(result.processingDateTime)+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        `+verified_seal_html;  

            $("#informationFields").html(html);
        });    
    }else if(process_name=="RETAILER"){
        getRetailerData(globSubContract,batchNo,function(result)
        {
            $("#batchTitle").html("Retailer Details");
            html = `<div class="form-group">
                            <b>Package ID:</b> `+result.packageID+` <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Expiry Date:</b> `+toDate(result.expiryDate)+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        <div class="form-group">
                            <b>Temperature:</b> `+result.temperature+`
                            <i class="fa fa-check-circle verified_info"></i>
                        </div>
                        `+verified_seal_html;  

            $("#informationFields").html(html);
        });    
    }

    $("#batchOverviewModel").modal();
}

function toDate(_timestamp) {

	var currentDate = new Date(_timestamp * 1000);
	var formattedDate = currentDate.toLocaleString(undefined, {
													day: 'numeric',
													month: 'numeric',
													year: 'numeric',
													hour: 'numeric',
													minute: 'numeric',
													second: 'numeric'
												});

	return formattedDate;
}

function toDateTime(_timestamp){
	var currentDate = new Date(_timestamp);
	var formattedDate = currentDate.toLocaleString();

	return formattedDate;
}