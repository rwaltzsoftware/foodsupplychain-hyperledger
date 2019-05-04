var globCurrentEditingBatchNo = false;
var globCurrentUser = false;

var userForm,
    farmInspectionForm,
    producerForm,
    exporterForm,
    carrierForm,
    distributorForm;
    processorForm;
    retailerForm;

$(document).ready(function(){
  
  userForm =  $("#updateUserForm").parsley();
  farmInspectionForm =  $("#farmInspectionForm").parsley();
  producerForm =  $("#producerForm").parsley(); 
  exporterForm =  $("#exporterForm").parsley(); 
  carrierForm =  $("#carrierForm").parsley();
  distributorForm =  $("#distributorForm").parsley();
  processorForm =  $("#processorForm").parsley();
  retailerForm =  $("#retailerForm").parsley();

  $('.datepicker-autoclose').datepicker({
        autoclose: true,
        todayHighlight: true,
        format:"dd-mm-yyyy"
    });
});

$(window).on("coinbaseReady", function ()
{
    getUser(globUserContract, function(data){      

      globCurrentUser = data ;

      if(data.isActive == true){
        if(data.name.trim().length <=0 && 
           data.contactNo.trim().length <=0 && 
           data.role.trim().length <=0 )
        {
          swal("Oops","Your Account was not found , Please contact Admin ","error");
          setTimeout(function()
          {
            window.location = "index.php";
          },1000);
          return ;
        }
      }else{
          swal({
              title: "Insufficient Access",
              text: "Your Account is blocked by Admin , Please contact to Admin",
              type: "error",
              showCancelButton: false,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Ok",
              closeOnConfirm: false
            },
            function(isConfirm)
            {
              if(isConfirm==true)
              {
               window.location = "index.php";
              }
            });
          return ;
      }  

      $("#userImage").attr('src','https://ipfs.io/ipfs/'+data.profileHash);
      $("#userName").html(data.name);
      $("#userContact").html(data.contactNo);
      $("#userRole").html(data.role);
      
    });

    getCultivationEvents(globMainContract);
});

/* --------------- User Section -----------------------*/
$("#editUser").on('click',function(){
  startLoader();
  getUser(globUserContract, function(data){
       
       $("#fullname").val(data.name);
       $("#contactNumber").val(data.contactNo);
       $("#role").val(data.role);
       $("#userProfileHash").val(data.profileHash);

       var profileImageLink = 'https://ipfs.io/ipfs/'+data.profileHash;
       
       var btnViewImage = '<br/><img src="'+profileImageLink+'" style="width:20%;"><br/>';
      $("#imageHash").html(btnViewImage);

       changeSwitchery($("#isActive"),data.isActive);
       switchery.disable();
       stopLoader();
       $("#userFormModel").modal();
    });
});

$("#userFormBtn").on('click',function(){

    if(userForm.validate())
    {
      var fullname      = $("#fullname").val();
      var contactNumber = $("#contactNumber").val();
      var role          = globCurrentUser.role;
      var userStatus    = $("#isActive").is(":checked");
      var profileHash   = $("#userProfileHash").val();

      var userDetails = {
          fullname : fullname,
          contact : contactNumber,
          role : role,
          status : userStatus,
          profile : profileHash
      };    

      updateUser(globUserContract, userDetails); 
    }
});

function getUser(contractRef,callback)
{
   contractRef.methods.getUser(globCoinbase).call(function (error, result) {
        if(error){
            alert("Unable to get User" + error);    
        }
        newUser = result;
        if (callback)
        {
            callback(newUser);
        }        
    });
}

function updateUser(contractRef,data)
{
  contractRef.methods.updateUser(data.fullname,data.contact,data.role,data.status,data.profile)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
        {
          $.magnificPopup.instance.close()
          handleTransactionResponse(hash);
          $("#userFormModel").modal('hide');
        })
        .on('receipt',function(receipt)
        {
            receiptMessage = "User Profile Updated Succussfully";
            handleTransactionReceipt(receipt,receiptMessage);
            $("#userFormModel").modal('hide');
        })
        .on('error',function(error)
        {
            handleGenericError(error.message);
            return;     
        });    
}

/* --------------- Activity Section -----------------------*/

function editActivity(batchNo)
{
  startLoader();
  globCurrentEditingBatchNo = batchNo;
}

/* --------------- Farm Inspection Section -----------------------*/


$("#updateFarmInspection").on('click',function(){

    if(farmInspectionForm.validate())
    {
      var data = {
        batchNo : globCurrentEditingBatchNo,
        soilType : $("#soilType").val().trim(),
        typeOfSeed : $("#typeOfSeed").val().trim(),
        fertilizerUsed : $("#fertilizerUsed").val().trim(),
        processName : $("#processName").val().trim(),
        certificateNumber : $("#certificateNumber").val().trim(),
      };    

      updateFarmInspection(globMainContract, data); 
    }
});

function updateFarmInspection(contractRef,data)
{
  contractRef.methods.updateFarmInspectorData(data.batchNo, data.soilType, data.typeOfSeed, data.fertilizerUsed, data.processName, data.certificateNumber)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
        {
          $.magnificPopup.instance.close()
          handleTransactionResponse(hash);
        })
        .on('receipt',function(receipt)
        {
            receiptMessage = "Farm Inspection Updated Succussfully";
            handleTransactionReceipt(receipt,receiptMessage)
        })
        .on('error',function(error)
        {
            handleGenericError(error.message);
            return;     
        });    
}

/* --------------- Producer Section -----------------------*/


$("#updateProducer").on('click',function(){

    if(producerForm.validate())
    {
      var data = {
        batchNo : globCurrentEditingBatchNo,
        cropVariety : $("#cropVariety").val().trim(),
        temperatureUsed : $("#temperatureUsed").val().trim(),
        humidity : $("#humidity").val().trim(),
      };    

      updateProducer(globMainContract, data); 
    }
});

function updateProducer(contractRef,data)
{
  contractRef.methods.updateProducerData(data.batchNo, data.cropVariety,data.temperatureUsed, data.humidity)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
        {
          $.magnificPopup.instance.close()
          handleTransactionResponse(hash);
        })
        .on('receipt',function(receipt)
        {
            receiptMessage = "Producer Updated Succussfully";
            handleTransactionReceipt(receipt,receiptMessage)
        })
        .on('error',function(error)
        {
            handleGenericError(error.message);
            return;     
        });    
}


/* --------------- Export Section -----------------------*/


$("#updateExport").on('click',function(){

    if(exporterForm.validate())
    {
      var tmpDate = $("#loadingDateTime").val().trim().split("-");
      tmpDate = tmpDate[1]+"/"+tmpDate[0]+"/"+tmpDate[2];     

      var data = {
        batchNo : globCurrentEditingBatchNo,
        exporterDetail : $("#exporterDetail").val().trim(),
        packageDetail : $("#packageDetail").val().trim(),
        destinationAddress : $("#destinationAddress").val().trim(),
        shipID : $("#shipID").val().trim(),
        quantity : parseInt($("#quantity").val().trim()),
        loadingDateTime : new Date(tmpDate).getTime() / 1000,
      };    

      updateExport(globSubContract, data); 
    }
});

function updateExport(contractRef,data)
{
  contractRef.methods.updateExporterData(data.batchNo, data.exporterDetail,data.packageDetail, data.destinationAddress, data.shipID, data.quantity, data.loadingDateTime)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
        {
          $.magnificPopup.instance.close()
          handleTransactionResponse(hash);
        })
        .on('receipt',function(receipt)
        {
            receiptMessage = "Export Updated Succussfully";
            handleTransactionReceipt(receipt,receiptMessage)
        })
        .on('error',function(error)
        {
            handleGenericError(error.message);
            return;     
        });    
}

/* --------------- Carrier Section -----------------------*/

$("#updateCarrier").on('click',function(){

    if(carrierForm.validate())
    {
      var tmpDate = $("#shipmentDateTime").val().trim().split("-");
      tmpDate = tmpDate[1]+"/"+tmpDate[0]+"/"+tmpDate[2]; 

      var data = {
        batchNo : globCurrentEditingBatchNo,
        carrierName : $("#carrierName").val().trim(),
        carrierNo : $("#carrierNo").val().trim(),
        shipmentID : $("#shipmentID").val().trim(),
        maintainedTemperature : ($("#maintainedTemperature").val().trim()),
        maintainedHumidity : ($("#maintainedHumidity").val().trim()),
        shipmentDateTime : new Date(tmpDate).getTime() / 1000,
      };    
      
      updateCarrier(globSubContract, data); 
    }
});

function updateCarrier(contractRef,data)
{
  contractRef.methods.updateCarrierData(data.batchNo, data.carrierName, data.carrierNo, data.shipmentID, data.maintainedTemperature, data.maintainedHumidity, data.shipmentDateTime)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
        {
          $.magnificPopup.instance.close()
          handleTransactionResponse(hash);
        })
        .on('receipt',function(receipt)
        {
            receiptMessage = "Carrier Updated Succussfully";
            handleTransactionReceipt(receipt,receiptMessage)
        })
        .on('error',function(error)
        {
            handleGenericError(error.message);
            return;     
        });    
}

/* --------------- Distributor Section -----------------------*/
$("#updateDistributor").on('click',function(){

    if(distributorForm.validate())
    {
      var data = {
        batchNo : globCurrentEditingBatchNo,
        certificateID : $("#certificateID").val().trim(),
        warehouseName : ($("#warehouseName").val().trim()),
        warehouseAddress : ($("#warehouseAddress").val().trim()),
        storageTemperature : ($("#storageTemperature").val().trim()),
        storageHumidity : ($("#storageHumidity").val().trim()),
        packagingDetail : ($("#packagingDetail").val().trim()),
        quantity : parseInt($("#distribution_quantity").val().trim()),
      };    

      updateDistributor(globSubContract, data); 
    }
});

function updateDistributor(contractRef,data)
{
  contractRef.methods.updateDistributorData(data.batchNo, data.certificateID, data.warehouseName, data.warehouseAddress, data.storageTemperature, data.storageHumidity, data.packagingDetail,data.quantity)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
  {
    $.magnificPopup.instance.close()
    handleTransactionResponse(hash);
  })
  .on('receipt',function(receipt)
  {
      receiptMessage = "Distributor Updated Succussfully";
      handleTransactionReceipt(receipt,receiptMessage)
  })
  .on('error',function(error)
  {
      handleGenericError(error.message);
      return;     
  });    
}

/* --------------- Processor Section -----------------------*/
$("#updateProcessor").on('click',function(){

    if(processorForm.validate())
    {

      var tmpDate = $("#processingDateTime").val().trim().split("-");
      tmpDate = tmpDate[1]+"/"+tmpDate[0]+"/"+tmpDate[2]; 

      var data = {
        batchNo : globCurrentEditingBatchNo,
        processorName : $("#processorName").val().trim(),
        processTemperature : ($("#processTemperature").val().trim()),
        internalBatchNo : ($("#internalBatchNo").val().trim()),
        packageName : ($("#packageName").val().trim()),
        packageAddress : ($("#packageAddress").val().trim()),
        processingDateTime : new Date(tmpDate).getTime() / 1000,
      };    

      updateProcessor(globSubContract, data); 
    }
});

function updateProcessor(contractRef,data)
{
  contractRef.methods.updateProcessorData(data.batchNo, data.processorName, data.processTemperature, data.internalBatchNo, data.packageName, data.packageAddress, data.processingDateTime)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
  {
    $.magnificPopup.instance.close()
    handleTransactionResponse(hash);
  })
  .on('receipt',function(receipt)
  {
      receiptMessage = "Processor Updated Succussfully";
      handleTransactionReceipt(receipt,receiptMessage)
  })
  .on('error',function(error)
  {
      handleGenericError(error.message);
      return;     
  });    
}

/* --------------- Retailer Section -----------------------*/
$("#updateRetailer").on('click',function(){

    if(retailerForm.validate())
    {

      var tmpDate = $("#retailerExpiryDate").val().trim().split("-");
      tmpDate = tmpDate[1]+"/"+tmpDate[0]+"/"+tmpDate[2]; 

      var data = {
        batchNo : globCurrentEditingBatchNo,
        packageID : $("#packageID").val().trim(),
        retailerTemperature : ($("#retailerTemperature").val().trim()),
        retailerExpiryDate : new Date(tmpDate).getTime() / 1000,
      };    

      updateRetailer(globSubContract, data); 
    }
});

function updateRetailer(contractRef,data)
{
  contractRef.methods.updateRetailerData(data.batchNo, data.packageID, data.retailerTemperature, data.retailerExpiryDate)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
  {
    $.magnificPopup.instance.close()
    handleTransactionResponse(hash);
  })
  .on('receipt',function(receipt)
  {
      receiptMessage = "Retailer Updated Succussfully";
      handleTransactionReceipt(receipt,receiptMessage)
  })
  .on('error',function(error)
  {
      handleGenericError(error.message);
      return;     
  });    
}

/*--------------------------------------------------------------------*/

function getCultivationEvents(contractRef) {
    contractRef.getPastEvents('PerformCultivation', {
        fromBlock: 0
    }).then(function (events) 
    {
      $("#totalBatch").html(events.length);
      counterInit();

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
              // $("#userCultivationTable").DataTable().destroy();
              var table = buildCultivationTable(finalEvents);
              $("#userCultivationTable").find("tbody").html(table);
              $("#userCultivationTable").DataTable({
                "displayLength": 10,
                "order": [[ 1, "asc" ]]
              });
              reInitPopupForm();
          }    
        },1000); 

        

        // $("#transactions tbody").html(buildTransactionData(events));
    }).catch(error => {
        console.log(error)
    });
}

function buildCultivationTable(finalEvents)
{
    $.magnificPopup.instance.popupsCache = {};

    var table = "";
    
    for (var tmpDataIndex in finalEvents)
    {   
        var elem = finalEvents[tmpDataIndex];
        var batchNo = elem.batchNo;
        var transactionHash = elem.transactionHash;
        var tr = "";
        
        if (elem.status == "FARM_INSPECTION") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                  `;
                  
              if(globCurrentUser.role == "FARM_INSPECTION")
              {
                tr+=`<td>
                          <a class="popup-with-form" title="Perform" style="color:#fff;" href="#farmInspectionForm" onclick="editActivity('`+batchNo+`')">
                            <span class="label label-info font-weight-100">
                            <i class="fa fa-pencil"></i>  
                            </span>
                          </a>
                      </td>`;
              }
              else
              {
                 tr+=`<td><span class="label label-warning font-weight-100"><i class="fa fa-pause"></i></span> </td>`;
              }

                
          tr+=`<td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
              <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
              <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
              <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
              <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
              <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
              
          </tr>`;

        } else if (elem.status == "PRODUCER") {
          tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    `;
                  if(globCurrentUser.role == "PRODUCER")
                  {
                    tr+=`<td>
                          <a class="popup-with-form" title="Perform" style="color:#fff;" href="#producerForm" onclick="editActivity('`+batchNo+`')">
                            <span class="label label-info font-weight-100">
                            <i class="fa fa-pencil"></i>  
                            </span>
                          </a>
                      </td>`;
                  }
                  else
                  {
                     tr+=`<td><span class="label label-warning font-weight-100"><i class="fa fa-pause"></i></span> </td>`;
                  }        

            tr+=`
                <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
            </tr>`;

        } else if (elem.status == "EXPORTER") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                  `;
                  
                  if(globCurrentUser.role == "EXPORTER")
                  {
                    tr+=`<td>
                            <a class="popup-with-form" title="Perform" style="color:#fff;" href="#exporterForm" onclick="editActivity('`+batchNo+`')">
                              <span class="label label-info font-weight-100">
                              <i class="fa fa-pencil"></i>  
                              </span>
                            </a>
                        </td>`;
                  }
                  else
                  {
                     tr+=`<td><span class="label label-warning font-weight-100"><i class="fa fa-pause"></i></span> </td>`;
                  } 

              tr+=`  
                   <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                   <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                   <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                   <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                </tr>`;
        } else if (elem.status == "CARRIER") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'EXPORTER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                  `;  

                  if(globCurrentUser.role == "CARRIER")
                  {
                    tr+=`<td>
                            <a class="popup-with-form" title="Perform" style="color:#fff;" href="#carrierForm" onclick="editActivity('`+batchNo+`')">
                              <span class="label label-info font-weight-100">
                              <i class="fa fa-pencil"></i>  
                              </span>
                            </a>
                        </td>`;
                  }
                  else
                  {
                     tr+=`<td><span class="label label-warning font-weight-100"><i class="fa fa-pause"></i></span> </td>`;
                  } 

              tr+=` 
                  <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                  <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                  <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                    
                </tr>`;
        } else if (elem.status == "DISTRIBUTOR") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'EXPORTER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CARRIER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                  `;
                  
                  if(globCurrentUser.role == "DISTRIBUTOR")
                  {
                    tr+=`<td>
                            <a class="popup-with-form" title="Perform" style="color:#fff;" href="#distributorForm" onclick="editActivity('`+batchNo+`')">
                              <span class="label label-info font-weight-100">
                              <i class="fa fa-pencil"></i>  
                              </span>
                            </a>
                         </td>`;
                  }
                  else
                  {
                     tr+=`<td><span class="label label-warning font-weight-100"><i class="fa fa-pause"></i></span> </td>`;
                  }  
                tr+=`    
                    <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                  <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                </tr>`;
        } else if (elem.status == "PROCESSOR") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'EXPORTER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CARRIER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'DISTRIBUTOR');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                  `;
                  
                  if(globCurrentUser.role == "PROCESSOR")
                  {
                    tr+=`<td>
                            <a class="popup-with-form" title="Perform" style="color:#fff;" href="#processorForm" onclick="editActivity('`+batchNo+`')">
                              <span class="label label-info font-weight-100">
                              <i class="fa fa-pencil"></i>  
                              </span>
                            </a>
                         </td>`;
                  }
                  else
                  {
                     tr+=`<td><span class="label label-warning font-weight-100"><i class="fa fa-pause"></i></span> </td>`;
                  }  
                tr+=`    
                  <td><span class="label label-danger font-weight-100" title="Not Available"><i class="fa fa-times"></i></span> </td>
                </tr>`;
        } else if (elem.status == "RETAILER") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'EXPORTER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CARRIER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'DISTRIBUTOR');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'PROCESSOR');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                  `;
                  
                  if(globCurrentUser.role == "RETAILER")
                  {
                    tr+=`<td>
                            <a class="popup-with-form" title="Perform" style="color:#fff;" href="#retailerForm" onclick="editActivity('`+batchNo+`')">
                              <span class="label label-info font-weight-100">
                              <i class="fa fa-pencil"></i>  
                              </span>
                            </a>
                         </td>`;
                  }
                  else
                  {
                     tr+=`<td><span class="label label-warning font-weight-100"><i class="fa fa-pause"></i></span> </td>`;
                  }  
                tr+=`    
                </tr>`;        
        } else if (elem.status == "DONE") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CULTIVATION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'FARM_INSPECTION');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'PRODUCER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'EXPORTER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'CARRIER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'DISTRIBUTOR');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'PROCESSOR');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                    <td>
                      <span class="label label-success font-weight-100" style="cursor:pointer;" title="Completed" onclick="viewBatchDetail(this,'RETAILER');" data-batch_no="`+batchNo+`">
                        <i class="fa fa-check"></i>
                      </span> 
                    </td>
                  `;  
                tr+=`    
                    
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

function reInitPopupForm()
{
  $('.popup-with-form').magnificPopup({
    type: 'inline',
    preloader: true,
    key: 'popup-with-form',
    // When elemened is focused, some mobile browsers in some cases zoom in
    // It looks not nice, so we disable it:
    callbacks: {
      open: function() {
        stopLoader();
      }
    }
  });
}