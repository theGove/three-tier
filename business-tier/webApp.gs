      ////////////////////////////////////////////////////////////////////////
     //                                                                    // 
    //            Be sure to configure your Airtable API token            //
   //             and Base ID at the top of Airtable_class.gs            //
  //                                                                    // 
 ////////////////////////////////////////////////////////////////////////


function debug_run(){
  // just a function to test things by running this from the google apps script editor
  const emp = new Employee()
  log("Employee Data",JSON.stringify(emp.get_data()))
  // see the results of console.log by choosing  View-->StackDriver Logging
}


function doGet(e){  // This is the function that responds to the web call
  log("at doGet","----e----",e)
  try{
    // initialize the table as an instance of a particular class
    const table = this[e.parameter.table.toLowerCase()]()
    if (e.parameter.mode==="update"){
      // validate and update data
      let message=table.validate_data(e.parameter.record,e.parameter.field, e.parameter.value)
      message.table=e.parameter.table
      message.record=e.parameter.record
      message.field = e.parameter.field
      return ContentService
      .createTextOutput( "data = " + JSON.stringify(message))
      .setMimeType(ContentService.MimeType.JAVASCRIPT);   
    }else{
      // return the number of records of a table specified in e.parameter.limit.  Max is 100
      return ContentService
      .createTextOutput( "data=" + JSON.stringify(table.get_data(e.parameter.limit)))
      .setMimeType(ContentService.MimeType.JAVASCRIPT);   
    }
  }catch(error){
    console.log("web app error:",error)
      return ContentService
      .createTextOutput( "data={exception:'" + error.message +"'}")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);   
  }
}

function log(){  // log to the console, but where we can turn of all logging in one place
  //return
  const values=[]
  for (const entry of arguments){
    if (typeof(entry) === "object") {
    values.push(JSON.stringify(entry))
    }else{
      values.push(entry)
    }
  }
  console.log(values)
}




