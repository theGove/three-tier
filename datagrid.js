// these are the two URLs google apps scripts gives you for your web app.  One for development and one for production
// You will get these values when you publish your google apps script as a web app
const dev_prefix=""  // look like this:  https://script.google.com/macros/s/ZKfycbxjS_raPupJx9G4nmYhe8C2poQH6bn_UoUV2puF9k0I/dev
const prod_prefix="" // looks like this: https://script.google.com/macros/s/XKfycbw-QDAs00bQmVbvINTipLA4OvR_Zv83P2IoyH-Vp6GRcEWLhMU/exec
let prefix=dev_prefix // set this to configure you code for working with your dev or production code on google apps script
const dealy_seconds = 4 // how long data validation messages are visible

//example call: file:///C:/Users/Gove/three-tier/datagrid.html?employee

function start_me_up(){  // runs when the body has loaded
    if(!prefix){prefix=prompt("Enter your Google Apps Web App access point.")}
    const table=window.location.search.substr(1)               // read the table from the url
    if(table){
        get_data(table)                                        // a table has been specified in the URL, open it
    }else{
        window.location.replace(window.location + "?Employee") // no table supplied in the URL, default to the Employee table
    }    
}

function get_data(table){ // get data from airtable for the specified table using the google apps script specfied atop this file
    document.title=table                                                 // put the table name on the browser tab holding the data
    const script = document.createElement('script')                      // make a new scrip tag to allow us to fetch data from google apps script
    script.id="data-script"                                              // set the ID of the sript tag so we can refer to it later
    script.onload = show_data                                            // after the script is loaded, run the show_data function
    script.src = prefix+'?table='+table+'&limit=100'+"&time="+Date.now() // get the script from google apps script
    document.head.appendChild(script)
}

function show_data(){  // the function that is executed when table data arrives
    const table=document.createElement('table')          // make a new TABLE element
    table.id="data-table"                                // set the ID of the table
    let thead = table.createTHead();                     // build the table heading
    let row = thead.insertRow();                         // put a row in the table heading
    for (const field of data.structure) {                // iterate across the fields in the data structure
        let th = document.createElement("th");           // create a TH tag for the column name
        let text = document.createTextNode(field.label); // create a text node to hold the name of the column
        th.appendChild(text);                            // put the field label text node in the column header
        row.appendChild(th);                             // put the TH tag into the row
    }
    let tbody = table.createTBody();                     // build the table body--now rows yet
    document.getElementById('data').appendChild(table)   // put the table onto the document
    for(const record of data.records){                   // itreate over the records received 
        add_row(record, tbody)                           // and make a row for each record received
    }    
}

function add_row(record, body){ // adds a row to the table body specified using data from record
    let row = body.insertRow()                                     // make a new row on the table
    for(const field of data.structure){                            // iterate over the data structure
        add_cell(field, record.fields[field.name], row, record.id) // build a cell for each field in the data structure
    }
}

function add_cell(field, value, row, id){ // adds a cell to a row
    let cell = row.insertCell();                        // make a new TD element in the table row
    const input=document.createElement('input')         // make an INPUT tag to put in the cell so the data is editable
    input.type="text"                                   // set the type of the INPUT so this will be editable data
    if(value!=undefined){input.value=value}             // if a value was passed in, put it in the value of the INPUT tag
    input.size = field.width                            // set the size of the input tag width specified
    input.onchange = change_value                       // confiture the INPUT tag so that it will execute the change_value function when the user changes the value 
    input.id = data.table + "-" + id + "-" + field.name // set up the id of of the INPUT tag so we know just what data to change in the database
    cell.appendChild(input);                            // put the fully configured INPUT tag into the cell
}

function change_value(){ // is triggered when a user changes a value in a cell of the table
    this.className="pending"                             // change the class of the INPUT tag holding the data to give a visiual cue that the data has not yet been written to the database
    if(document.getElementById('data-script')){          // if we have already fetched data using this script tag, remove the old one
        document.getElementById('data-script').remove()
    }
    const script = document.createElement('script')      // create a new script tag to receive the data from google apps script
    script.id="data-script"                              // set the id so we can refer to it later  
    script.onload = handle_message                       // configure the script so that it will execute the handle_message fucntion when it has been update
    const params=this.id.split("-")                      // split the INPUT tag's id into its component parts
    script.src=prefix                                    // set the source of the script so it will call the google apps script with the appropriate parameters
               + "?mode=update&table=" + params[0]  
               + "&record=" + params[1] + "&field=" 
               + params[2] + "&value="
               + encodeURIComponent(this.value)
               + "&time=" + Date.now()    
    document.head.appendChild(script)                    // add the script the document heading
 }

 function handle_message(){ // deals with the data returned after updating (or failing to update) a column value on airtable through google apps script
    const tag = document.getElementById(message.table + "-"      // find the INPUT tag that has the data the user entered
                                      + message.record + "-" 
                                      + message.field)
    if(message.error){                                           // see if the message that came back from google apps script has an error message
      tag.className="error"                                      // there is a error message, so make the INPUT tag look like an error (red background) by default, but you could change it in style.css
      const row=tag.parentElement.parentElement                  // get a reference to the row that contatins the cell that contains the INPUT tag that the user changed
      const table = document.getElementById("data-table")        // get a reference to the table that holds the data
      const cell = table.insertRow(row.rowIndex+1).insertCell(0) // insert a row after the row that hold the field the user changed AND insert a cell on the row
      cell.innerHTML = message.error.message                     // put the the error message in the newly added cell
      cell.colSpan=row.cells.length                              // make the cell span the whole width of the table 
      cell.className="message"                                   // put the right class so it will be styled according to style.css
      let delay=setInterval(function(){                          // initiate the function to clear the message after the nubmer of seconds specified atop this file
        if(message.value){                                       // Google apps script sent back a value to replace the users entered value.  This could be becuase it is reverting to a prior value or because it formatted what the user entered  
            tag.className=""                                     // change the style of the INPUT tag to be normal data
            tag.value=message.value                              // replace the value the user entered with the value passed back from google apps script
        }else{                                                   // there was no value passed back from google apps script
            tag.focus()                                          // set the focus to the INPUT tag, but leave it formatted as an error and leave the value the user typed.  It needs work.
        }
        table.deleteRow(row.rowIndex+1)                          // delete the row in the table added to show the error message
        clearInterval(delay)                                     // prevent another call to this function because it has been handled
      }, dealy_seconds*1000);                                    // part of the initial call to clear the message.  This line specifies how long to wait to clear the message
    }else{
        tag.value=message.value                                  // there was no error message, just update the value with what google apps script passed back
        tag.className=""                                         // remove the "pending" class from the INPUT tag so the field looks like regular data again
    }
}

