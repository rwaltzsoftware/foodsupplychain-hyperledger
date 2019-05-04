import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  

  selectedUserListing:any;
  activeUserEdit: any;
  activeBatch: any;
  activeBatchSection:any;
  
  arrUserListing:any[];
  arrUserListingCount:number;
  arrUserType:any[];
  
  arrBatchListing: any;
  arrBatchListingCount: any;

  userAddFrm: FormGroup;
  userEditFrm: FormGroup;
  arrInspectorList: Object;
  arrCreatorList: Object;
  batchAddFrm: FormGroup;


  constructor(private http:HttpClient,
              @Inject('WINDOW') private window: any,
              private spinner: NgxSpinnerService) {

    this.arrUserListingCount = 0;

    this.arrUserType = [
      {name:'Inspector'},
      {name:'Producer'},
      {name:'Exporter'},
      {name:'Carrier'},
      {name:'Distributor'},
      {name:'Processor'},
      {name:'Retailer'},
    ];

    this.selectedUserListing = "Inspector";


    this.userAddFrm = new FormGroup({
      'user_id': new FormControl('',[Validators.required]),
      'name': new FormControl('',[Validators.required]),
      'contact': new FormControl('',[Validators.required]),
      'role': new FormControl('',[Validators.required]),
      'profile_image': new FormControl('',[Validators.required])
    });

    this.userEditFrm = new FormGroup({
      'user_id': new FormControl('',[]),
      'name': new FormControl('',[Validators.required]),
      'contact': new FormControl('',[Validators.required]),
      'role': new FormControl('',[]),
      'profile_image': new FormControl('',[Validators.required])
    });

    this.batchAddFrm = new FormGroup({
      'registration_no': new FormControl('',[Validators.required]),
      'food_name': new FormControl('',[Validators.required]),
      'other_details': new FormControl('',[Validators.required]),
      'creator': new FormControl('',[Validators.required]),
      'inspector_handler': new FormControl('',[Validators.required]),
    });
  }

  ngOnInit() {
    this.onUserChangeListing(this.selectedUserListing);
    this.loadBatchListing();
    
  }

  onUserChangeListing(userType:any){
    this.loadUserListing(userType);
  }

  loadUserListing(type:any) {
    this.spinner.show();

    this.http.get('http://localhost:3000/api/'+type).subscribe((response:any) => {
      this.arrUserListing = response;
      this.arrUserListingCount = this.arrUserListing.length;

      this.spinner.hide();
    });
  }

  loadBatchListing() {
    this.spinner.show();

    this.http.get('http://localhost:3000/api/Batch').subscribe((response:any) => {
      this.arrBatchListing = response;
      this.arrBatchListingCount = this.arrBatchListing.length;

      this.spinner.hide();
    });
  }

  saveUser(frmInstance,action){

    if(action == "add")
    {
      let user = {
        "$class": "org.foodsupplychain.user."+frmInstance.get('role').value,
        "status": "Active",
        "user_id": frmInstance.get('user_id').value,
        "name": frmInstance.get('name').value,
        "contact": frmInstance.get('contact').value,
        "role": frmInstance.get('role').value,
        "profile_image": frmInstance.get('profile_image').value
      }
      
      this.selectedUserListing = user.role;

      this.spinner.show();
      this.http.post('http://localhost:3000/api/'+user.role,user).subscribe((response:any) => {
        this.onUserChangeListing(this.selectedUserListing);
        this.spinner.hide();

        $('#userAddFormModel').modal("hide");
      });
    }
    else if(action == "edit")
    {
      this.activeUserEdit.role = this.activeUserEdit.role == "string" ? "Inspector" : this.activeUserEdit.role;

      let user = {
        "$class": "org.foodsupplychain.user."+this.activeUserEdit.role,
        "status": this.activeUserEdit.status,
        "role": this.activeUserEdit.role,
        "name": frmInstance.get('name').value,
        "contact": frmInstance.get('contact').value,
        "profile_image": frmInstance.get('profile_image').value
      };
  
      this.selectedUserListing = this.activeUserEdit.role;

      this.spinner.show();
      this.http.put('http://localhost:3000/api/'+user.role+'/'+ this.activeUserEdit.user_id,user).subscribe((response:any) => {
        this.onUserChangeListing(this.selectedUserListing);
        this.spinner.hide();

        $('#userEditFormModel').modal("hide");
      });
    }
  }



  toggleUserStatus(userData,status){

    let user = {
      "$class": "org.foodsupplychain.user.Inspector",
      "status":status,
      "name":userData.name,
      "contact":userData.contact,
      "role":userData.role,
      "profile_image":userData.profile_image,
    };

    this.spinner.show();
    this.http.put('http://localhost:3000/api/'+userData.role+'/'+userData.user_id,user).subscribe((response:any) => {
      this.onUserChangeListing(this.selectedUserListing);
      this.spinner.hide();
    });
  }

  setActiveUserEdit(userData){
    this.activeUserEdit = userData;

    this.userEditFrm.get('user_id').setValue(userData.user_id);
    this.userEditFrm.get('name').setValue(userData.name);
    this.userEditFrm.get('contact').setValue(userData.contact);
    this.userEditFrm.get('role').setValue(userData.role);
    this.userEditFrm.get('profile_image').setValue(userData.profile_image);
  }

  showBatchDetails(batchDetails,step)
  {
    this.activeBatchSection = step;
    this.activeBatch = batchDetails;


    $("#batchOverviewModel").modal();
  }

  async showBatchCreation()
  {
    this.spinner.show();

    this.arrInspectorList = await this.http.get('http://localhost:3000/api/Inspector').toPromise(); 
    this.arrCreatorList = await this.http.get('http://localhost:3000/api/Creator').toPromise(); 

    this.spinner.hide();

    $("#batchFormModel").modal();
  }


  saveBatch(frmInstance,action){

    if(action == "add")
    {
      let batch = {
        "$class": "org.foodsupplychain.system.BatchCreation",
        "creator": frmInstance.get('creator').value,
        "inspector_handler":frmInstance.get('inspector_handler').value,
        "registration_no": frmInstance.get('registration_no').value,
        "food_name": frmInstance.get('food_name').value,
        "other_details": frmInstance.get('other_details').value,
      }
      
      this.spinner.show();
      this.http.post('http://localhost:3000/api/BatchCreation',batch).subscribe((response:any) => {
        this.loadBatchListing();
        this.spinner.hide();

        $('#batchFormModel').modal("hide");
      });
    }
    else if(action == "edit")
    {
      this.activeUserEdit.role = this.activeUserEdit.role == "string" ? "Inspector" : this.activeUserEdit.role;

      let user = {
        "$class": "org.foodsupplychain.user."+this.activeUserEdit.role,
        "status": this.activeUserEdit.status,
        "role": this.activeUserEdit.role,
        "name": frmInstance.get('name').value,
        "contact": frmInstance.get('contact').value,
        "profile_image": frmInstance.get('profile_image').value
      };
  
      this.selectedUserListing = this.activeUserEdit.role;

      this.spinner.show();
      this.http.put('http://localhost:3000/api/'+user.role+'/'+ this.activeUserEdit.user_id,user).subscribe((response:any) => {
        this.onUserChangeListing(this.selectedUserListing);
        this.spinner.hide();

        $('#userEditFormModel').modal("hide");
      });
    }
  }

}
