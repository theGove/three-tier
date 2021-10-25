      ////////////////////////////////////////////////////////////////////////
     //                                                                    // 
    //            Be sure to configure your Airtable API token            //
   //             and Base ID at the top of Airtable_class.gs            //
  //                                                                    // 
 ////////////////////////////////////////////////////////////////////////


function debug_run(){
  const e = {parameter:{limit:5,table:"Door"}}
  log("response",get_request(e))
}

function doGet(e){  // This is the function that responds to the web call
  return ContentService
      .createTextOutput( "data=" + JSON.stringify(get_request(e)))
      .setMimeType(ContentService.MimeType.JAVASCRIPT);   
}

function get_request(e){
  log("at get_request","----e----",e)
  try{
    // initialize the table as an instance of a particular class
    const table = this[e.parameter.table.toLowerCase()]()
    log("table",table)
    if (e.parameter.mode==="update"){
      // validate and update data
      let message=table.validate_data(e.parameter.record,e.parameter.field, e.parameter.value)
      message.table=e.parameter.table
      message.record=e.parameter.record
      message.field = e.parameter.field
      return message
    }else{
      // return the number of records of a table specified in e.parameter.limit.  Max is 100
      const data = table.get_data(e.parameter.limit)
      return data
    }
  }catch(error){
    console.log("web app error:",error)
      return {exception:error.message}
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




