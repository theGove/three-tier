class Airtable {
  constructor(table) { // class constructor
    this.table=table
    this.api="https://api.airtable.com/v0/"
    
    // 1. Browe to https://airtable.com/account
    // 2. Search for "This is your personal API key."
    this.airtable_token = "yourAirtableAPIkeyHere"  // example: keybjiCcpZu1h4L6C
    
    // 1. Browse to https://airtable.com/api
    // 2. Click on the base you want to use
    // 3. Search for "The ID of this base is"
    this.airtable_baseid = "yourBaseIDhere" // example: appYpPMqTs05719pH
  }
  
    // ----------------  Class Methods  ----------------
  get_data(limit) {
    //gets the specified number of records from the table this class is configured to work with at aritable
    log("at Airtable get_date","----limit----",limit)

    if(!limit){limit=100}
    const url = this.api+this.airtable_baseid+'/'+this.table+'?maxRecords='+limit+'&view=Grid%20view';
    const options = {
      "headers" : {
        "Authorization": "Bearer " + this.airtable_token
      }
    };
    const response = UrlFetchApp.fetch(url, options)
    const data = JSON.parse(response.getContentText())
    data.structure = this.get_structure()
    data.table = this.table
    return data;
  }
  
  get_record(id) {
    //gets the specified record from the specified table at aritable
    log("at Airtable get_record","----id----",id)
    
    const url = this.api+this.airtable_baseid+'/'+this.table+'/'+id;
    const options = {
      "headers" : {
        "Authorization": "Bearer " + this.airtable_token
      }
    };
    const response = UrlFetchApp.fetch(url, options)
    const data = JSON.parse(response.getContentText())
    data.structure = this.get_structure()
    data.table = this.table
    return data;
  }
  
  
  update_data(record_id, field_name, value) {
    //updates a field on a record
    log("at Airtable update_data","----record_id----",record_id,"----field_name----",field_name,"----value----", value)
    
    const url = this.api+this.airtable_baseid+'/'+this.table
    
    
    let data = {"records": [{"id": record_id,"fields": {}}]}
    if(value===""){
      data.records[0].fields[field_name]=null
    }else{
      data.records[0].fields[field_name]=value
    }
    
    const headers = {
      "Content-Type" : "application/json",
      "Authorization": "Bearer " + this.airtable_token
    };
    
    const options = {
      'contentType':'application/json',
      'method' : 'PATCH',
      'headers': headers,
      'payload' : JSON.stringify(data),
      'muteHttpExceptions': true,
    };
    
    
    try{
      const response = UrlFetchApp.fetch(url, options)  
      let message=JSON.parse(response.getContentText())
      const record=this.get_record(record_id)
      message.value = record.fields[field_name]
      return message;
    }catch(e){
      console.log("error",e.message)
      return e
    }
    
  }
  
  validation_message(new_value, error_message){
    // builds the message to be returned after data validation
    log("at Airtable validation_message","----new_value----",new_value,"----error_message----",error_message)
      return{value:new_value,
             error:{message:error_message,
                    type:"INVALID_VALUE_FOR_COLUMN"}
            }
  }

  
  toProperCase (txt) {  // retrns the proper case analog of txt
    log("at Airtable toProperCase","----txt----",txt)
    return txt.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  validate_phone_number(phone_number){
    // if the phone_number includes exactly 10 numbers, returns a properly formatted phone number, otherwise, null
    log("at Airtable validate_phone_number","----phone_number----",phone_number)
    const data = phone_number.replace(/\D/g,'');
    if(data.length===10){
      return data.substr(0,3)+"-"+data.substr(3,3)+"-"+data.substr(6,4)
    }else{
      return null
    }
  }
  
  
  
}// end of class
