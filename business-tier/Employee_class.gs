function employee(){return new Employee()}


class Employee extends Airtable {
  constructor() { 
    super("Employee")
  }

  
  // ----------------  Class Methods  ----------------

  get_structure() {
    // returns default labels and widths for each field in the table
    log("at Employee get_structure")

    return [
        {name:"first_name",width:15,label:"First Name"},
        {name:"last_name" ,width:15,label:"Last Name"},
        {name:"address"   ,width:25,label:"Address"},
        {name:"city"      ,width:10,label:"City"},
        {name:"state"     ,width:4, label:"State"},
        {name:"phone"     ,width:10,label:"Phone"},
        {name:"hire_date" ,width:10,label:"Date Hired"},
        {name:"birth_date",width:10,label:"Birthday"},
        {name:"photo",width:10,label:"Photo"}
    ]
  }


  
  validate_data(record_id, field_name, value) {
    // validates the data according to the rules here if all validation rules pass
    // updates the data; otherwise, returns message describing why the data was not updated

    log("at Employee validate_data","----record_id----",record_id,"----field_name----",field_name,"----value----",value)
    
    switch(field_name){
      case "birth_date":
        // check to be sure that the date if birth is more than 18 years before today
        if(value){//only check if a birth date has been entered
          const date_now = new Date()
          const date_born  = new Date(value)
          if ((date_now-date_born)/(1000*60*60*24*365.25)<18){
            this.validation_message(this.get_record(record_id).fields[field_name]
                                  ,"Date of Birth must be at least 18 years before today")
          }
        }
        break // end of case birth_date
      case "hire_date":
        // check to be sure that the date hired is more than 18 years after the birth date
        if(value){//only check if a hire date has been entered
          const record = this.get_record(record_id)
          const date_hired = new Date(value.replace(/-/g,"/"))
          const date_born  = new Date(record.fields.birth_date)
          if ((date_hired-date_born)/(1000*60*60*24*365.25)<18){
            // employee is less than 18 years old when hired, disallow
            this.validation_message(record.fields.hire_date
                                  ,"Date hired must be at least 18 years after birth date")
          }
        }
        break // end of case hire_date
      case "phone":
        let new_number= this.validate_phone_number(value)
        if(value){//only check if a phone number has been entered
          if(new_number){
            //the number has been formatted
            value=new_number
          }else{
            this.validation_message(this.get_record(record_id).fields[field_name]
                                  ,"Phone number must have 10 numeric digits")
          }
        }
        break // end of case phone
      case "state":
        if(value){//only check if a state has been entered
          if(value.length===2){
            //data is valid, make it uppercase
            value=value.toUpperCase()
          }else{
            this.validation_message(this.get_record(record_id).fields[field_name]
                                  ,"State must be 2 characters")
          }
        }
        break // end of case state
      case "last_name":
        if(value){
          if(value===value.toLowerCase()){
            value=this.toProperCase(value)
          }
        }else{
          // Do not allow last name to be empty
          const record=this.get_record(record_id)
            this.validation_message(this.get_record(record_id).fields[field_name]
                                  ,"Last Name is not allowed to be empty")
        }
        break// end of case last_name
      case "first_name":
      case "address":
      case "city":
        // if all lower case, switch to proper case
        if(value===value.toLowerCase()){
          value=this.toProperCase(value)
        }  
        // there is no message to be returned here.  We are just modifying the 
        // value to be written to the database
        
        break// end of case first_name, address, city
        
    }
    
    // we we made it this far, the data are valid.  Use them to update the DB
    return this.update_data(record_id, field_name, value)
  }
  
  
}