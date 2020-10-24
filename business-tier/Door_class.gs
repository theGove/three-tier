function door(){return new Door()}


class Door extends Airtable {
  constructor() { // class constructor
    super("Door")
  }


  
  // ----------------  Class Methods  ----------------

  get_structure() {
   // returns default labels and widths for each field in the table
   return [
        {name:"door_style",width:20,label:"Style"},
        {name:"color",width:20,label:"Color"},
        {name:"country",width:20,label:"Country"},
        {name:"city",width:20,label:"City"}
      ]
  }
  
  validate_data(record_id, field_name, value) {
    // validates the data according to the rules here if all validation rules pass
    // updates the data; otherwise, returns an error

    switch(field_name){
      case "style":
      case "color":
      case "country":
      case "city":
        if(value){
            // there is a value.  If all lower case, adjust to proper case
            if(value===value.toLowerCase()){
              value=this.toProperCase(value)
            }
        }else{
            // There is no value supplied.
            // restore the value from the origianl record and send a message
            return{value:this.get_record(record_id).fields[field_name],
                   error:{message:field_name + " is not allowed to be empty",
                          type:"INVALID_VALUE_FOR_COLUMN",
                          }
                   }// end of return value
        }
        break
        
    }// end of switch
    
    
    return this.update_data(record_id, field_name, value)
  }// end of validate_data method   
  
}// end of door class