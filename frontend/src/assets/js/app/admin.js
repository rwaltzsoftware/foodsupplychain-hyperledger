var chartData = [];

$(window).on('coinbaseReady',function(){
	getUserEvents(globUserContract);
	getCultivationEvents(globMainContract);
    getFarmInspectionEvents(globMainContract);
    getProductionEvents(globMainContract);
    getExportEvents(globSubContract);
    getCarrierEvents(globSubContract);
    getDistributorEvents(globSubContract);
    getProcessorEvents(globSubContract);
    getRetailerEvents(globSubContract);

    setInterval(function () {
        if(chartData.length == 7){
            initChart(chartData);   
        }
    }, 500); 
});

function userFormSubmit(){

	if($("form#userForm").parsley().isValid()){

		var userWalletAddress = $("#userWalletAddress").val();
		var userName          = $("#userName").val();
		var userContactNo     = $("#userContactNo").val();
		var userRoles         = $("#userRoles").val();
		var isActive          = $("#isActive").is(":checked");
		var userImageAddress  = $("#userProfileHash").val();

		globUserContract.methods.updateUserForAdmin(userWalletAddress,userName,userContactNo,userRoles,isActive,userImageAddress)
		.send({from:globCoinbase, to:globUserContract._address})
		.on('transactionHash',function(hash){
			 handleTransactionResponse(hash);
			 $("#userFormModel").modal('hide');
		})
		.on('receipt', function(receipt){
			receiptMessage = "User Created Successfully";
      		handleTransactionReceipt(receipt,receiptMessage);
      		$("#userFormModel").modal('hide');
      		getUserEvents(globUserContract);
		})
		.on('error',function(error)
		{
		    handleGenericError(error.message);
		    return;   
		});
	}
}

function addCultivationBatch()
{

    if (batchFormInstance.validate())
    {
        var farmerRegistrationNo = $("#farmerRegistrationNo").val().trim();
        var foodName = $("#foodName").val().trim();
        var farmerName = $("#farmerName").val().trim();
        var farmerAddress = $("#farmerAddress").val().trim();
        var exporterName = $("#exporterName").val().trim();
        var carrierName = $("#carrierName").val().trim();

        globMainContract.methods.addBasicDetails(farmerRegistrationNo, foodName, farmerName, farmerAddress, exporterName, carrierName)
        .send({
            from: globCoinbase,
            to: globMainContract._address
        })
        .on('transactionHash', function (hash) {
            handleTransactionResponse(hash);
            $("#batchFormModel").modal('hide');
        })
        .on('receipt', function (receipt) {
            receiptMessage = "Token Transferred Successfully";
            handleTransactionReceipt(receipt, receiptMessage);
            $("#batchFormModel").modal('hide');
            getCultivationEvents(globMainContract);
        })
        .on('error', function (error) {
            handleGenericError(error.message);
            return;
        });
    }
}


function getCultivationEvents(contractRef) {
    contractRef.getPastEvents('PerformCultivation', {
        fromBlock: 0
    }).then(function (events) 
    {
    	$("#totalBatch").html(events.length);
        
        var finalEvents = [];
        $.each(events,function(index,elem)
        {
            var tmpData = {};
            tmpData.batchNo = elem.returnValues.batchNo;
            tmpData.transactionHash = elem.transactionHash;
            getBatchStatus(contractRef, tmpData.batchNo).then(result => {
                tmpData.status = result;
                finalEvents.push(tmpData);
            });
        });

        setTimeout(function()
        {
        	if(finalEvents.length > 0){
	            var table = buildCultivationTable(finalEvents);
                // $("#adminCultivationTable").DataTable().destroy();
	            $("#adminCultivationTable").find("tbody").html(table);
                
                $("#adminCultivationTable").DataTable({
                    "displayLength": 10,
                    "order": [[ 1, "asc" ]]
                });

	            $('.qr-code-magnify').magnificPopup({
				    type:'image',
				    mainClass: 'mfp-zoom-in'
				});
          
	        }    

            counterInit();
        },1000); 

    }).catch(error => {
        console.log(error)
    });
}

function getFarmInspectionEvents(contractRef){
    contractRef.getPastEvents('DoneInspection',{
        fromBlock: 0
    })
    .then((events)=>{
        chartData.push({
                           label: "Farm Inspection",
                           data: events.length,
                           color: "#4f5467", 
                        });
        
    })
    .catch((error)=>{
        console.log(error);
    });
}

function getProductionEvents(contractRef){
    contractRef.getPastEvents('DoneProducing',{
        fromBlock: 0
    })
    .then((events)=>{
        chartData.push({
                           label: "Production",
                           data: events.length,
                           color: "#00c292", 
                        });
        
    })
    .catch((error)=>{
        console.log(error);
    });
}

function getExportEvents(contractRef){
    contractRef.getPastEvents('DoneExporting',{
        fromBlock: 0
    })
    .then((events)=>{
        chartData.push({
                           label: "Export",
                           data: events.length,
                           color: "#01c0c8", 
                        });
        
    })
    .catch((error)=>{
        console.log(error);
    });
}

function getCarrierEvents(contractRef){
    contractRef.getPastEvents('DoneCarrying',{
        fromBlock: 0
    })
    .then((events)=>{
        chartData.push({
                           label: "Carrier",
                           data: events.length,
                           color: "#ffaa80", 
                        });
        
    })
    .catch((error)=>{
        console.log(error);
    });
}

function getDistributorEvents(contractRef){
    contractRef.getPastEvents('DoneDistribution',{
        fromBlock: 0
    })
    .then((events)=>{
        chartData.push({
                           label: "Distribution",
                           data: events.length,
                           color: "#d2ff4d", 
                        });
        
    })
    .catch((error)=>{
        console.log(error);
    });
}

function getProcessorEvents(contractRef){
    contractRef.getPastEvents('DoneProcessing',{
        fromBlock: 0
    })
    .then((events)=>{
        chartData.push({
                           label: "Processor",
                           data: events.length,
                           color: "#e580ff", 
                        });
        
    })
    .catch((error)=>{
        console.log(error);
    });
}

function getRetailerEvents(contractRef){
    contractRef.getPastEvents('DoneRetailing',{
        fromBlock: 0
    })
    .then((events)=>{
        chartData.push({
                           label: "Retailer",
                           data: events.length,
                           color: "#ff9999", 
                        });
        
    })
    .catch((error)=>{
        console.log(error);
    });
}

function buildCultivationTable(finalEvents)
{
    var table = "";
    
    for (var tmpDataIndex in finalEvents)
    {   
        var elem = finalEvents[tmpDataIndex];

        var perbatchPer = 100/8;
        var batchProgressPer = 0;
        var batchNo = elem.batchNo;
        var transactionHash = elem.transactionHash;
        var tr = "";
        var url = 'https://rinkeby.etherscan.io/tx/'+transactionHash;
        var qrCode = 'https://chart.googleapis.com/chart?cht=qr&chld=H|1&chs=400x400&chl='+url;
			
        var commBatchTd = `<td>`+batchNo+` <a href="`+url+`" class="text-danger" target="_blank"><i class="fa fa-external-link"></i></a>
                               <br/>
                               <span class="text-info">60%</span>
                               <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:60%;"> </div> 
                           </td>`;
        var commQrTd = `<td><a href="`+qrCode+`" title="`+transactionHash+`" class="qr-code-magnify" data-effect="mfp-zoom-in">
				        	<img src="`+qrCode+`" class="img-responsive" style="width:30px; height:30px;">
				        </a>
				    </td>`;
		var commActionTd = `<td><a href="view-batch.php?batchNo=`+batchNo+`&txn=`+transactionHash+`" target="_blank" class="text-inverse p-r-10" data-toggle="tooltip" title="View"><i class="ti-eye"></i></a> </td>`;		    
		 

		if (elem.status == "FARM_INSPECTION") {
            batchProgressPer = perbatchPer * 1;
            tr = `<tr>
            		<td>`+batchNo+` <a href="`+url+`" class="text-danger" target="_blank"><i class="fa fa-external-link"></i></a>
                       <br/>
                       <span class="text-info">`+batchProgressPer+`% Completed</span>
                       <div class="progress m-b-0">
                        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:`+batchProgressPer+`%;"> 
                        </div> 
                       </div>
                    </td> 
                    `+commQrTd+`
                    <td><i class="fa fa-check-circle fa-2x completed_info" onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-pause-circle fa-2x processing_info" title="Processing"></i></td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                </tr>`;
        } else if (elem.status == "PRODUCER") {
            batchProgressPer = perbatchPer * 2;

            tr = `<tr> 
                    <td>`+batchNo+` <a href="`+url+`" class="text-danger" target="_blank"><i class="fa fa-external-link"></i></a>
                       <br/>
                       <span class="text-info">`+batchProgressPer+`% Completed</span>
                       <div class="progress m-b-0">
                        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:`+batchProgressPer+`%;"> 
                        </div> 
                       </div>
                    </td>     
                    `+commQrTd+`
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-pause-circle fa-2x processing_info" title="Processing"></i></td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i></td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i></td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i></td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i></td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i></td>
                </tr>`;
        } else if (elem.status == "EXPORTER") {
            batchProgressPer = perbatchPer * 3;

            tr = `<tr>
                    <td>`+batchNo+` <a href="`+url+`" class="text-danger" target="_blank"><i class="fa fa-external-link"></i></a>
                       <br/>
                       <span class="text-info">`+batchProgressPer+`% Completed</span>
                       <div class="progress m-b-0">
                        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:`+batchProgressPer+`%;"> 
                        </div> 
                       </div>
                    </td>     
                    `+commQrTd+`
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-pause-circle fa-2x processing_info" title="Processing"></i></td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                </tr>`;
        } else if (elem.status == "CARRIER") {
            batchProgressPer = perbatchPer * 4;

            tr = `<tr>
                    <td>`+batchNo+` <a href="`+url+`" class="text-danger" target="_blank"><i class="fa fa-external-link"></i></a>
                       <br/>
                       <span class="text-info">`+batchProgressPer+`% Completed</span>
                       <div class="progress m-b-0">
                        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:`+batchProgressPer+`%;"> 
                        </div> 
                       </div>
                    </td>     
                    `+commQrTd+`
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'EXPORTER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-pause-circle fa-2x processing_info" title="Processing"></i></td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                </tr>`;
        } else if (elem.status == "DISTRIBUTOR") {
            batchProgressPer = perbatchPer * 5;

            tr = `<tr>
                    <td>`+batchNo+` <a href="`+url+`" class="text-danger" target="_blank"><i class="fa fa-external-link"></i></a>
                       <br/>
                       <span class="text-info">`+batchProgressPer+`% Completed</span>
                       <div class="progress m-b-0">
                        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:`+batchProgressPer+`%;"> 
                        </div> 
                       </div>
                    </td> 
                    `+commQrTd+`
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'EXPORTER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'CARRIER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-pause-circle fa-2x processing_info" title="Processing"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                </tr>`;
        } else if (elem.status == "PROCESSOR") {
            batchProgressPer = perbatchPer * 6;

            tr = `<tr>
                    <td>`+batchNo+` <a href="`+url+`" class="text-danger" target="_blank"><i class="fa fa-external-link"></i></a>
                       <br/>
                       <span class="text-info">`+batchProgressPer+`% Completed</span>
                       <div class="progress m-b-0">
                        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:`+batchProgressPer+`%;"> 
                        </div> 
                       </div>
                    </td> 
                    `+commQrTd+`
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'EXPORTER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'CARRIER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'DISTRIBUTOR');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-pause-circle fa-2x processing_info" title="Processing"></i> </td>
                    <td><i class="fa fa-times-circle fa-2x not_complete_info" title="Not Completed"></i> </td>
                </tr>`;  
        } else if (elem.status == "RETAILER") {
            batchProgressPer = perbatchPer * 7;

            tr = `<tr>
                    <td>`+batchNo+` <a href="`+url+`" class="text-danger" target="_blank"><i class="fa fa-external-link"></i></a>
                       <br/>
                       <span class="text-info">`+batchProgressPer+`% Completed</span>
                       <div class="progress m-b-0">
                        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:`+batchProgressPer+`%;"> 
                        </div> 
                       </div>
                    </td>     
                    `+commQrTd+`
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'EXPORTER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'CARRIER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'DISTRIBUTOR');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'PROCESSOR');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-pause-circle fa-2x processing_info" title="Processing"></i> </td>
                </tr>`;                 
        } else if (elem.status == "DONE") {
            batchProgressPer = perbatchPer * 8;

            tr = `<tr>
                    <td>`+batchNo+` <a href="`+url+`" class="text-danger" target="_blank"><i class="fa fa-external-link"></i></a>
                       <br/>
                       <span class="text-info">`+batchProgressPer+`% Completed</span>
                       <div class="progress m-b-0">
                        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:`+batchProgressPer+`%;"> 
                        </div> 
                       </div>
                    </td>    
                    `+commQrTd+`
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`" title="Completed"></i></td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'EXPORTER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'CARRIER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'DISTRIBUTOR');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'PROCESSOR');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                    <td><i class="fa fa-check-circle fa-2x completed_info"  onclick="viewBatchDetail(this,'RETAILER');" data-batch_no="`+batchNo+`" title="Completed"></i> </td>
                </tr>`;
        }

        table+=tr;
    }

    return table;
    
}

function getBatchStatus(contractRef, batchNo)
{
    return contractRef.methods.getNextAction(batchNo)
        .call();
       
}




