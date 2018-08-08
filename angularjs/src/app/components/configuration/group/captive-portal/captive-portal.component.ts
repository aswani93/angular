import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ScrollHelper } from '../../../../helpers/scroll-helper/scrollHelper';
import { TabsetComponent } from 'ngx-bootstrap';
import { TooltipService } from '../../../../services/tooltip/tooltip.service';

@Component({
  selector: 'app-captive-portal',
  templateUrl: './captive-portal.component.html',
  styleUrls: ['./captive-portal.component.css']
})
export class CaptivePortalComponent implements OnInit {

  public label: string = "Add Profile"
  public selectedProfiles = [];
  public selected_profile;
  public isAllProfilesSelected: boolean= false;
  public is_add_profile: boolean = false;
  public is_update_profile: boolean = false;
  public ProfileRegForm: FormGroup;
  public isChecked: boolean = false;
  private scrollHelper: ScrollHelper = new ScrollHelper();
  private focusInterval;
  private focused: boolean = false;
  public profile_data;
  public complete_profile_data;
  public search_key: string = '';
  public imageSource: string = '';
  public imageHeader: string ='';
  public mockapi_profile_data;

  @ViewChild('captivePortalTabs') captiveTabs: TabsetComponent;
  constructor(
    private eleRef : ElementRef,
    private tooltipService: TooltipService
  ) {}

  ngOnInit() {

    this.mockapi_profile_data = [
      {'profile_id':1,
       'portal_name':'HFCL Network - 1', 
       'auth':'auth',
       'redirect_to':'original-url',
       'redirect_url':'www.hfclnetwork1.com',
       'idleTimeout':1200,
       'fontColor': 'white',
       'backgroundPicture':'../../../../../assets/images/captive_portal-1.png',
       'companyName': 'HFCL',
       'logoPicture':'Logo',
       'welcomeMessage': 'Welcome to the HFCL Network',
       'username':'User Name',
       'password':'Password',
       'loginbtn':'Login',
       'copyrightMsg':'HFCL Inc.© All Rights Reserved 2018',
       'advtPic':'Advert pic',
       'advtLink':'www.boradbandoptic.com',
       'agreementTitle':'Unlimited Fibre',
       'agreementMessage':'100Mbps speed',
       'no_of_groups':17, 
       'preview':'preview1'},

       {'profile_id':2,
       'portal_name':'HFCL Network - 2', 
       'auth':'auth',
       'redirect_to':'original-url',
       'redirect_url':'www.hfclnetwork2.com',
       'idleTimeout':1200,
       'fontColor': 'white',
       'backgroundPicture':'../../../../../assets/images/captive_portal-2.png',
       'companyName': 'BSNL',
       'logoPicture':'Logo',
       'welcomeMessage': 'Welcome to the HFCL Network',
       'username':'Email Id',
       'password':'Password',
       'loginbtn':'Go',
       'copyrightMsg':'HFCL Inc.© All Rights Reserved 1997',
       'advtPic':'Advert pic',
       'advtLink':'www.uninteruptednetwork.com',
       'agreementTitle':'Fastest network',
       'agreementMessage':'150Mbps speed',
       'no_of_groups':20, 
       'preview':'preview2'},

       {'profile_id':3,
       'portal_name':'BSNL Network', 
       'auth':'auth',
       'redirect_to':'original-url',
       'redirect_url':'www.bsnlnetwork.com',
       'idleTimeout':1200,
       'fontColor': 'white',
       'backgroundPicture':'../../../../../assets/images/captive_portal-3.png',
       'companyName': 'BSNL',
       'logoPicture':'Logo',
       'welcomeMessage': 'Welcome to the BSNL Network',
       'username':'Email Id',
       'password':'Password',
       'loginbtn':'Go',
       'copyrightMsg':'BSNL Inc.© All Rights Reserved 1997',
       'advtPic':'Advert pic',
       'advtLink':'www.uninteruptednetwork.com',
       'agreementTitle':'Fastest network',
       'agreementMessage':'110Mbps speed',
       'no_of_groups':15, 
       'preview':'preview3'},
    ];

    this.loadData();
    this.generateForm();

  }

  ngAfterViewChecked(){
    if(!this.focused){
      this.scrollHelper.doScroll();
    }
  }

  generateForm(){
    this.ProfileRegForm = new FormGroup({
      "portal_name": new FormControl('New Portal Name', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
        this.noEmoji
      ]),
      "auth": new FormControl('auth',[]),
      "redirect_to":new FormControl('original-url',[]),
      "redirect_url": new FormControl('',[]),
      "idleTimeout": new FormControl('1200',[]),
      "fontColor": new FormControl('white',[]),
      "backgroundPicture": new FormControl('Background Pic',[]),
      "companyName": new FormControl('EXCALIBUR',[]),
      "logoPicture": new FormControl('companylogo',[]),
      "welcomeMessage": new FormControl('Welcome',[]),
      "username": new FormControl('Username field',[]),
      "password": new FormControl('Password',[]),
      "loginbtn": new FormControl('GO',[]),
      "copyrightMsg": new FormControl('Copyright 2018',[]),
      "advtPic": new FormControl('advtpic',[]),
      "advtLink": new FormControl('www.excalibur.com',[]),
      "agreementTitle": new FormControl('Agreement Title',[]),
      "agreementMessage": new FormControl('Agreement Message',[]),
      "no_of_groups": new FormControl('50',[]),
      "preview": new FormControl('preview3',[]),
    })
  }

  public noEmoji(control: FormControl){
    let isEmoji = /(?:[\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|(?:\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6]|\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0]))/.test(control.value);
    let isValid = !isEmoji;
    return isValid ? null : { 'emoji': true }
  }

  selectAllProfiles(event){
    this.isAllProfilesSelected = !this.isAllProfilesSelected;
    if(this.isAllProfilesSelected){
      for(let profile of this.profile_data){
        this.selectedProfiles.push(profile);
      }
      if(this.selectedProfiles.length == 1){
        this.selected_profile = this.selectedProfiles[0].profile_id;
      }else{
        this.selected_profile = null;
      }
      this.isChecked = true;
    }else{
      this.unCheckAll();
      this.isAllProfilesSelected = false;
      this.selectedProfiles = [];
      this.isChecked = false;
      //reset the form here after api is done
    }


  }

  unCheckAll(){
    var chkLen = this.eleRef.nativeElement.querySelectorAll('.profile-check').length;
    for (var i = 0; i < chkLen; i++) {
      this.eleRef.nativeElement.querySelectorAll('.profile-check')[i]['checked'] = false;
    }
  }


  double_click_event(event, profile, index){
    this.selectedProfiles = [];
    this.unCheckAll();
    this.selectedProfiles.push(profile);
    if(this.selectedProfiles.length == 1){
      this.selected_profile = profile.profile_id;
      this.eleRef.nativeElement.querySelectorAll('.profile-check')[index]['checked'] = true;
      this.isChecked = true;
    } else {
      this.selected_profile = null;
    }
    this.getProfileDetails();
    this.setFocus();

    //Temporary until html template is chosen
    this.imageSource = profile.backgroundPicture;
    this.imageHeader = profile.portal_name;

  }

  selectProfile(profile, event){
    if(event.target.checked){
      this.selectedProfiles.push(profile);
      this.selected_profile = (this.selectedProfiles.length == 1)? profile.profile_id : null;
      this.isChecked = true; 
    }
    else{
      let currentProfile = this.selectedProfiles.find(
        function (arr) {return arr.profile_id = profile.profile_id});
      let index = this.selectedProfiles.indexOf(currentProfile);
      this.selectedProfiles.splice(index, 1);
      
      if(this.selectedProfiles.length == 1){
        this.selected_profile = this.selectedProfiles[0].profile_id;
        this.isChecked = true;        
      }
      else{
        this.selected_profile = null;
        if(this.selectedProfiles.length < 1){
          this.isAllProfilesSelected = false;
          this.selectedProfiles = [];
          this.isChecked = false;
        }else{
          this.isChecked = true;
        }

      }
    }

  }

  deleteData(){
    //Delete the data after api is done
  }

  searchProfile(){
    let val = this.search_key;
    let search_columns = ['portal_name', 'redirect_url', 'no_of_groups']
    if(val.length > 2){
      this.profile_data = this.complete_profile_data.filter(function(d){
        let matchFound = false;
        for(let data of search_columns){
          let value = ""+d[data];
          if(value.toLowerCase().indexOf(val) !== -1 || !val){
            matchFound = true;
            break;
          }
        }      
        
        return matchFound;
      });
    }
    else{
      this.profile_data = this.complete_profile_data;
    }
  }

  btnAddProfile(){
    this.is_add_profile = true;
    this.is_update_profile = false;
    this.label = "Add Group";
    this.setFocus();
    this.generateForm();
    
    ////Temporary until html template is chosen
    this.imageSource = "../../../../../assets/images/captive_portal-3.png";
    this.imageHeader = this.ProfileRegForm.get('portal_name').value;

  }

  setFocus() {
    this.scrollHelper.scrollToFirst("ssid-config-tabs");
    this.scrollHelper.scrollToFirst("full-tabset");
    this.focusInterval = setTimeout(() => {
      this.focused = true;
    },500);
  }

  loadData(){
    this.complete_profile_data = this.mockapi_profile_data;
    this.profile_data = this.complete_profile_data;
  }

  getProfileDetails(){
    if(this.selectedProfiles.length == 1){
      this.is_update_profile = true;
      this.is_add_profile = false;
      let result;
      for(let profile of this.profile_data){
        if(profile.profile_id == this.selected_profile){
          result = profile;
          break;
        }
      }
      this.label = result.portal_name;
      delete result.profile_id;
      this.ProfileRegForm.setValue(result);
    }
    else{
      //common error messages
    }
  }

  formReset(){
    this.isChecked = false;
    this.ProfileRegForm.reset();
    this.is_add_profile = false;
    this.is_update_profile = false;
    this.focused = false;
    this.isAllProfilesSelected = false;
    this.selectedProfiles = [];
    this.eleRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    this.unCheckAll();
  }

  selectTab(tab_id: number) {
    this.captiveTabs.tabs[tab_id].active = true;
  }

  previewPortal(imagePath, imageHeader){
    this.imageSource = imagePath;
    this.imageHeader = imageHeader;
  }

  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }
  

}
