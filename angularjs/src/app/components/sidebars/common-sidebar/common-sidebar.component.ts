import {Component, OnInit, ElementRef} from '@angular/core';
import {ActivatedRoute, Router, Event, NavigationEnd} from '@angular/router';
import * as $ from 'jquery';
import { NotificationService,commonMessages } from '../../../services/notificationService/NotificationService';


@Component({
  selector: 'app-common-sidebar',
  templateUrl: './common-sidebar.component.html',
  styleUrls: ['./common-sidebar.component.css']
})
export class CommonSidebarComponent implements OnInit {

  private activeMenu: string;
  private activeMenuComponent: string;
  private strLength;

  constructor(private route: ActivatedRoute, private router: Router, private eleRef: ElementRef,private notifyPopup : NotificationService) {
    this.activeMenu = this.route.snapshot.data['activeSideMenu'];
    let parentArray = [
      {
        name: 'dashboard',
        parent: []
      },
      {
        name: 'DHCP',
        parent: [
          {
            name: 'system',
            parent: [
              {
                name: 'configuration',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'groupConfiguration',
        parent: [
          {

            name: 'group',
            parent: [
              {
                name: 'configuration',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name:'captivePortalConfiguration',
        parent: [
          {

            name: 'group',
            parent: [
              {
                name: 'configuration',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'ssidConfiguration',
        parent: [
          {
            name: 'group',
            parent: [
              {
                name: 'configuration',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'macAclConfiguration',
        parent: [
          {
            name: 'group',
            parent: [
              {
                name: 'configuration',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'imageupgrade',
        parent: [
          {
            name: 'ap',
            parent: [
              {
                name: 'maintenance',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'apReboot',
        parent: [
          {
            name: 'ap',
            parent: [
              {
                name: 'maintenance',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'rogueAP',
        parent: [
          {
            name: 'ap',
            parent: [
              {
                name: 'maintenance',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'restoreDefault',
        parent: [
          {
            name: 'System',
            parent: [
              {
                name: 'maintenance',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'remoteMaintenance',
        parent: [
          {
            name: 'System',
            parent: [
              {
                name: 'maintenance',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'alarmsetting',
        parent: [
          {
            name: 'System',
            parent: [
              {
                name: 'maintenance',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'reboot',
        parent: [
          {
            name: 'System',
            parent: [
              {
                name: 'maintenance',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'backupRestore',
        parent: [
          {
            name: 'System',
            parent: [
              {
                name: 'maintenance',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'systemUpgrade',
        parent: [
          {
            name: 'System',
            parent: [
              {
                name: 'maintenance',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'autoRF',
        parent: [
          {
            name: 'ap',
            parent: [
              {
                name: 'maintenance',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'alarm',
        parent: [
          {
            name: 'mon_system',
            parent: [
              {
                name: 'monitor',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'vm',
        parent: [
          {
            name: 'mon_system',
            parent: [
              {
                name: 'monitor',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'rogueAPMonitoring',
        parent: [
          {
            name: 's_accesspoint',
            parent: [
              {
                name: 'monitor',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'unregisteredAP',
        parent: [
          {
            name: 'accesspoint',
            parent: [
              {
                name: 'configuration',
                parent: []
              }
            ]
          }
        ]
      }
      ,
      {
        name: 'registeredAP',
        parent: [
          {
            name: 'accesspoint',
            parent: [
              {
                name: 'configuration',
                parent: []
              }
            ]
          }
        ]
      }, {
        name: 'confbasic',
        parent: [
          {
            name: 'system',
            parent: [
              {
                name: 'configuration',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'emssnmp',
        parent: [
          {
            name: 'system',
            parent: [
              {
                name: 'configuration',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'aaaserver',
        parent: [
          {
            name: 'system',
            parent: [
              {
                name: 'configuration',
                parent: []
              }]
          }
        ]
      }, {
        name: 'ipconfig',
        parent: [
          {
            name: 'system',
            parent: [
              {
                name: 'configuration',
                parent: []
              }]
          }
        ]
      },
      {
        name: 'redundancy',
        parent: [
          {
            name: 'system',
            parent: [
              {
                name: 'configuration',
                parent: []
              }
            ]
          }
        ]
      }
      ,
      {
        name: 'userAccount',
        parent: [
          {
            name: 'system',
            parent: [
              {
                name: 'configuration',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'statistics',
        parent: [
          {
            name: 's_accesspoint',
            parent: [
              {
                name: 'monitor',
                parent: []
              }
            ]
          }
        ]
      }
      ,
      {
        name: 'airQuality',
        parent: [
          {
            name: 's_accesspoint',
            parent: [
              {
                name: 'monitor',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'autoRFMonitoring',
        parent: [
          {
            name: 's_accesspoint',
            parent: [
              {
                name: 'monitor',
                parent: []
              }
            ]
          }
        ]
      },
      {
        name: 'access_general',
        parent: [
          {
            name: 's_accesspoint',
            parent: [
              {
                name: 'monitor',
                parent: []
              }
            ]
          }
        ]
      }, {
        name: 'general',
        parent: [
          {
            name: 'mon_system',
            parent: [
              {
                name: 'monitor',
                parent: []
              }
            ]
          }
        ]
      }, {
        name: 'systemstatistics',
        parent: [
          {
            name: 'mon_system',
            parent: [
              {
                name: 'monitor',
                parent: []
              }
            ]
          }
        ]
      }
    ];
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url != '/login' && event.url != '/') {
          this.strLength = event.url.split('/').length;
          this.activeMenuComponent = event.url.split('/')[this.strLength - 1];
          let val = this.activeMenuComponent;
          let menuArray = parentArray.find(function (menuArray) {
            return menuArray.name === val;
          });
          if (menuArray.parent.length > 0) {

            let submenu = menuArray.parent['0'].name;
            let main_menu = menuArray.parent['0'].parent['0'].name;
            let submenu_a = submenu + '_a';
            let main_menu_a = main_menu + '_a';
            $('#leftmenu').find('li.active').removeClass('active');
            $('#leftmenu').find('a.open').removeClass('open');
            if (submenu != undefined) {
              $('#' + submenu).addClass('active');
              $('#' + submenu_a).addClass('open');
            }
            if (main_menu != undefined) {
              $('#' + main_menu).addClass('active');
              $('#' + main_menu_a).addClass('open');
            }
          }
          $('#' + val).addClass('active');
        }
        else{
          this.notifyPopup.hideLoader('');
        }
      }

    });

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    $('#leftmenu a').click(function () {

      $(this).parent('li').children('ul').slideToggle();
      $(this).parent('li').siblings().children('ul').slideUp();
      $(this).parent('li').siblings().children('ul').children().children('ul').slideUp();

      $(this).toggleClass('open');
      $(this).siblings().children().children('a').removeClass('open');
      $(this).parent().siblings().children('a').removeClass('open');
      $(this).parent().siblings().children('ul').children().children('a').removeClass('open');

    });
  }


}
