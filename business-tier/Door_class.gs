function door(){return new Door()}


class Door extends Airtable {
  constructor() { // class constructor
    super("Door")
  }


  
  // ----------------  Class Methods  ----------------

  get_structure() {
   log("at Door get_structure")
   // returns default labels and widths for each field in the table
   return [
        {name:"door_code" ,width:10,label:"Code", static:true},
        {name:"door_style",width:12,label:"Style"},
        {name:"color"     ,width:12,label:"Color"},
        {name:"city"      ,width:15,label:"City"},
        {name:"country"   ,width:15,label:"Country"},
      ]
  }
  
  validate_data(record_id, field_name, value) {
    // validates the data according to the rules here if all validation rules pass
    // updates the data; otherwise, returns message describing why the data was not updated
    log("at Door validate_data","----record_id----",record_id,"----field_name----",field_name,"----value----",value)
     

    switch(field_name){
      case "door_code":
     
           break
      case "door_style":
           const allowed_styles="bifold bypass flush french panel pocket"
           switch(value.toLowerCase()){
              case'bi':value="bifold";break
              case'by':value="bypass";break
              case'fl':value="flush" ;break
              case'fr':value="french";break
              case'pa':value="panel" ;break
              case'po':value="pocket";break
              case '' :return this.validation_message(this.get_record(record_id).fields[field_name]
                                                      ,field_name + " is not allowed to be empty")
           }
          value=value.toLowerCase()
          if(! allowed_styles.includes(value)){
            return this.validation_message(this.get_record(record_id).fields[field_name]
                                                      , "Style must be one of: " + allowed_styles)
          }
          break
      case "color":value=this.toProperCase(value)
          break
      case "country":
      case "city":
        if(!value){
            // There is no value supplied.
            // restore the value from the origianl record and send a message
            return this.validation_message(this.get_record(record_id).fields[field_name]
                                          ,field_name + " is not allowed to be empty")
        }else if(value.toLowerCase()==="provo"){
            return this.validation_message(this.get_record(record_id).fields[field_name]
                                          ,"No scaring is allowed in Provo")
        }else{
            // there is a value.  If all lower case, adjust to proper case
            if(value===value.toLowerCase()){
              value=this.toProperCase(value)
            }
        }
        break
        
    }// end of switch
    
    
    return this.update_data(record_id, field_name, value)
  }// end of validate_data method   
  
  
}// end of door class