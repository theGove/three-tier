      ////////////////////////////////////////////////////////////////////////
     //                                                                    // 
    //            Be sure to configure your Airtable API token            //
   //             and Base ID at the top of Airtable_class.gs            //
  //                                                                    // 
 ////////////////////////////////////////////////////////////////////////


function debug_run(){
  // just a function to test things by running this from the google apps script editor
  const table = new Employee()
  console.log("response",table.validate_data("recqfhz0cWZDVT2ge","birth_date","2010-1-1"))
  // see the results of console.log by choosing  View-->StackDriver Logging
}


function doGet(e){  // This is the function that responds to the web call
  
  // initialize the table as an instance of a particular class
  const table = this[e.parameter.table.toLowerCase()]()
  
  console.log("e",e)
  if (e.parameter.mode==="update"){
    // validate and update data
    let message=table.validate_data(e.parameter.record,e.parameter.field, e.parameter.value)
    message.table=e.parameter.table
    message.record=e.parameter.record
    message.field = e.parameter.field
    return ContentService
    .createTextOutput( "message = " + JSON.stringify(message))
    .setMimeType(ContentService.MimeType.JAVASCRIPT);   
  }else{
    // return the number of records of a table specified in e.parameter.limit.  Max is 100
    return ContentService
    .createTextOutput( "data=" + JSON.stringify(table.get_data(e.parameter.limit)))
    .setMimeType(ContentService.MimeType.JAVASCRIPT);   
  }
}





