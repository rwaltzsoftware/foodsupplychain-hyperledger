function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4()+s4() +'-'+ s4() +'-'+ s4() +'-'+ s4() +'-'+ s4()+s4()+s4();
}

/**
 * BatchCreation transaction
 * @param {org.foodsupplychain.system.BatchCreation} BatchCreation
 * @transaction
  
 */
async function BatchCreation(tx){
    
    let _batch_id = guid();
  
    let _Batch = await getFactory().newResource('org.foodsupplychain.system', 'Batch', _batch_id);
  
    let _assetRegistry = await getAssetRegistry('org.foodsupplychain.system.Batch');
    let _doesBatchExists = await _assetRegistry.exists(_batch_id);
    
    if(_doesBatchExists == true)
    {
      throw new Error("batch with batchId: " + _batch_id + ", already exists and can not add as a new batch ");
    }
  
    let user_id = tx.creator.user_id;
    
    let _creatorRegistry = await getParticipantRegistry('org.foodsupplychain.user.Creator');
  
    let _userData = await _creatorRegistry.get(user_id);
    
    if(_userData.status != 'Active')
    {
       throw new Error("Creator account needs to be active ");
    }
    
    _Batch.batch_id = _batch_id;
    _Batch.batch_status = 'Creation';
    _Batch.creation_registration_no = tx.registration_no;
    _Batch.creation_food_name = tx.food_name;
    _Batch.creation_other_details = tx.other_details;
    _Batch.creator = tx.creator;
    _Batch.inspector = tx.inspector_handler;
  
  
    let _txStatus = await _assetRegistry.add(_Batch);
}

/**
 * BatchInspection transaction
 * @param {org.foodsupplychain.system.BatchInspection} BatchInspection
 * @transaction
  
 */
async function BatchInspection(tx){

    let _Batch = tx.batch;
  
    let _assetRegistry = await getAssetRegistry('org.foodsupplychain.system.Batch');
    let _doesBatchExists = await _assetRegistry.exists(_Batch.batch_id);
    
    if(_doesBatchExists == false)
    {
      throw new Error("batch with batchId: " + _batch_id + ", doesnot exists and can not add as a new batch ");
    }
  
    
    if(tx.inspector_handler.status != 'Active')
    {
       throw new Error("Inspector account needs to be active ");
    }
  
    if(tx.producer_handler.status != 'Active')
    {
       throw new Error("Producer account needs to be active ");
    }
    
    if(_Batch.batch_status != 'Creation')
    {
       throw new Error("Inspection data can only be updated after Creation and before Production");
    }
    
    if(_Batch.inspector.getIdentifier() != tx.inspector_handler.getIdentifier() )
    {
       throw new Error("Inspector with ID : "+_Batch.inspector.getIdentifier() +" is authorized to perform this action."); 
    }
    


    _Batch.batch_status = 'Inspector';
    _Batch.inspection_process_name = tx.process_name;
    _Batch.inspection_certificate_no = tx.certificate_no;
    _Batch.inspection_other_details = tx.other_details;
    _Batch.producer = tx.producer_handler;  
  
  
    let _txStatus = await _assetRegistry.update(_Batch);
}

/**
 * BatchProducer transaction
 * @param {org.foodsupplychain.system.BatchProducer} BatchProducer
 * @transaction
  
 */
async function BatchProducer(tx){

    let _Batch = tx.batch;
  
    let _assetRegistry = await getAssetRegistry('org.foodsupplychain.system.Batch');
    let _doesBatchExists = await _assetRegistry.exists(_Batch.batch_id);
    
    if(_doesBatchExists == false)
    {
      throw new Error("batch with batchId: " + _batch_id + ", doesnot exists and can not add as a new batch ");
    }
  
    
    if(tx.producer_handler.status != 'Active')
    {
       throw new Error("Producer account needs to be active ");
    }
  
    if(tx.exporter_handler.status != 'Active')
    {
       throw new Error("Exporter account needs to be active ");
    }
    
    if(_Batch.batch_status != 'Inspector')
    {
       throw new Error("Production data can only be updated after Inspection and before Export");
    }
    
    if(_Batch.producer.getIdentifier() != tx.producer_handler.getIdentifier() )
    {
       throw new Error("Producer with ID : "+_Batch.producer.getIdentifier() +" is authorized to perform this action."); 
    }


    _Batch.batch_status = 'Producer';
    _Batch.producer_temperature_used = tx.temperature_used;
    _Batch.producer_humidity = tx.humidity;
    _Batch.producer_other_details = tx.other_details;
    _Batch.exporter = tx.exporter_handler;  
  
  
    let _txStatus = await _assetRegistry.update(_Batch);
}

/**
 * BatchExporter transaction
 * @param {org.foodsupplychain.system.BatchExporter} BatchExporter
 * @transaction
  
 */
async function BatchExporter(tx){

    let _Batch = tx.batch;
  
    let _assetRegistry = await getAssetRegistry('org.foodsupplychain.system.Batch');
    let _doesBatchExists = await _assetRegistry.exists(_Batch.batch_id);
    
    if(_doesBatchExists == false)
    {
      throw new Error("batch with batchId: " + _batch_id + ", doesnot exists and can not add as a new batch ");
    }
  
    
    if(tx.exporter_handler.status != 'Active')
    {
       throw new Error("Exporter account needs to be active ");
    }
  
    if(tx.carrier_handler.status != 'Active')
    {
       throw new Error("Carrier account needs to be active ");
    }
    
    if(_Batch.batch_status != 'Producer')
    {
       throw new Error("Exporter data can only be updated after Production and before Carriage");
    }

    if(_Batch.exporter.getIdentifier() != tx.exporter_handler.getIdentifier() )
    {
       throw new Error("Exporter with ID : "+_Batch.exporter.getIdentifier() +" is authorized to perform this action."); 
    }
    
    _Batch.batch_status = 'Exporter';
    _Batch.exporter_package_id = tx.package_id;
    _Batch.exporter_shipment_id = tx.shipment_id;
    _Batch.exporter_destination_address = tx.destination_address;
    _Batch.exporter_qty = tx.qty;
    _Batch.exporter_other_details = tx.other_details;
    _Batch.exporter_loading_date = tx.loading_date;
    
    _Batch.carrier = tx.carrier_handler;
  
  
    let _txStatus = await _assetRegistry.update(_Batch);
}

/**
 * BatchCarrier transaction
 * @param {org.foodsupplychain.system.BatchCarrier} BatchCarrier
 * @transaction
  
 */
async function BatchCarrier(tx){

    let _Batch = tx.batch;
  
    let _assetRegistry = await getAssetRegistry('org.foodsupplychain.system.Batch');
    let _doesBatchExists = await _assetRegistry.exists(_Batch.batch_id);
    
    if(_doesBatchExists == false)
    {
      throw new Error("batch with batchId: " + _batch_id + ", doesnot exists and can not add as a new batch ");
    }
  
    
    if(tx.distributor_handler.status != 'Active')
    {
       throw new Error("Exporter account needs to be active ");
    }
  
    if(tx.carrier_handler.status != 'Active')
    {
       throw new Error("Carrier account needs to be active ");
    }
    
    if(_Batch.batch_status != 'Exporter')
    {
       throw new Error("Carrier data can only be updated after Exporter and before Distributor");
    }
    
    if(_Batch.carrier.getIdentifier() != tx.carrier_handler.getIdentifier() )
    {
       throw new Error("Carrier with ID : "+_Batch.carrier.getIdentifier() +" is authorized to perform this action."); 
    }

    _Batch.batch_status = 'Carrier';
    _Batch.carrier_id = tx.id;
    _Batch.carrier_shipment_id = tx.shipment_id;
    _Batch.carrier_maintained_temperature = tx.maintained_temperature;
    _Batch.carrier_humidity = tx.humidity;
    _Batch.carrier_other_details = tx.other_details;
    _Batch.carrier_shipped_date = tx.shipped_date;
    _Batch.carrier_delivery_date = tx.delivery_date;
    
    _Batch.distributor = tx.distributor_handler;
  
  
    let _txStatus = await _assetRegistry.update(_Batch);
}

/**
 * BatchDistributor transaction
 * @param {org.foodsupplychain.system.BatchDistributor} BatchDistributor
 * @transaction
  
 */
async function BatchDistributor(tx){

    let _Batch = tx.batch;
  
    let _assetRegistry = await getAssetRegistry('org.foodsupplychain.system.Batch');
    let _doesBatchExists = await _assetRegistry.exists(_Batch.batch_id);
    
    if(_doesBatchExists == false)
    {
      throw new Error("batch with batchId: " + _batch_id + ", doesnot exists and can not add as a new batch ");
    }
  
    
    if(tx.distributor_handler.status != 'Active')
    {
       throw new Error("Exporter account needs to be active ");
    }
  
    if(tx.processor_handler.status != 'Active')
    {
       throw new Error("Carrier account needs to be active ");
    }
    
    if(_Batch.batch_status != 'Carrier')
    {
       throw new Error("Distributor data can only be updated after Carriage and before Processor");
    }
    
    if(_Batch.distributor.getIdentifier() != tx.distributor_handler.getIdentifier() )
    {
       throw new Error("Distributor with ID : "+_Batch.distributor.getIdentifier() +" is authorized to perform this action."); 
    }

    _Batch.batch_status = 'Distributor';
    _Batch.distributor_certificate_id = tx.certificate_id;
    _Batch.distributor_warehouse_name = tx.warehouse_name;
    _Batch.distributor_warehouse_address = tx.warehouse_address;
    _Batch.distributor_storage_temperature = tx.storage_temperature;
    _Batch.distributor_storage_humidity = tx.storage_humidity;
    _Batch.distributor_quantity = tx.quantity;
    _Batch.distributor_other_details = tx.other_details;
    
    _Batch.processor = tx.processor_handler;
  
  
    let _txStatus = await _assetRegistry.update(_Batch);
}

/**
 * BatchProcessor transaction
 * @param {org.foodsupplychain.system.BatchProcessor} BatchProcessor
 * @transaction
  
 */
async function BatchProcessor(tx){

    let _Batch = tx.batch;
  
    let _assetRegistry = await getAssetRegistry('org.foodsupplychain.system.Batch');
    let _doesBatchExists = await _assetRegistry.exists(_Batch.batch_id);
    
    if(_doesBatchExists == false)
    {
      throw new Error("batch with batchId: " + _batch_id + ", doesnot exists and can not add as a new batch ");
    }
  
    
    if(tx.exporter_handler.status != 'Active')
    {
       throw new Error("Exporter account needs to be active ");
    }
  
    if(tx.carrier_handler.status != 'Active')
    {
       throw new Error("Carrier account needs to be active ");
    }
    
    if(_Batch.batch_status != 'Distributor')
    {
       throw new Error("Processor data can only be updated after Distributor and before Retailer");
    }
    
    if(_Batch.processor.getIdentifier() != tx.processor_handler.getIdentifier() )
    {
       throw new Error("Processor with ID : "+_Batch.processor.getIdentifier() +" is authorized to perform this action."); 
    }


    _Batch.batch_status = 'Processor';
    _Batch.processor_temperature = tx.temperature;
    _Batch.processor_internal_batch_id = tx.internal_batch_id;
    _Batch.processor_date = tx.date;
    _Batch.processor_other_details = tx.other_details;
    
    _Batch.retailer = tx.retailer_handler;
  
  
    let _txStatus = await _assetRegistry.update(_Batch);
}

/**
 * BatchRetailer transaction
 * @param {org.foodsupplychain.system.BatchRetailer} BatchRetailer
 * @transaction
  
 */
async function BatchRetailer(tx){

    let _Batch = tx.batch;
  
    let _assetRegistry = await getAssetRegistry('org.foodsupplychain.system.Batch');
    let _doesBatchExists = await _assetRegistry.exists(_Batch.batch_id);
    
    if(_doesBatchExists == false)
    {
      throw new Error("batch with batchId: " + _batch_id + ", doesnot exists and can not add as a new batch ");
    }
  
    
    if(tx.exporter_handler.status != 'Active')
    {
       throw new Error("Exporter account needs to be active ");
    }
  
    if(tx.carrier_handler.status != 'Active')
    {
       throw new Error("Carrier account needs to be active ");
    }
    
    if(_Batch.batch_status != 'Processor')
    {
       throw new Error("Retailer data can only be updated after Processor ");
    }
    
    if(_Batch.retailer.getIdentifier() != tx.retailer_handler.getIdentifier() )
    {
       throw new Error("Retailer with ID : "+_Batch.retailer.getIdentifier() +" is authorized to perform this action."); 
    }
    
    _Batch.batch_status = 'Retailer';
    _Batch.retailer_expiry_date = tx.expiry_date;
    _Batch.retailer_temperature = tx.temperature;
    _Batch.retailer_other_details = tx.other_details;
    
    let _txStatus = await _assetRegistry.update(_Batch);
}