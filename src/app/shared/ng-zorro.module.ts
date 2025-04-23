import { NgModule } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzImageModule } from 'ng-zorro-antd/image';

// Icon declarations
import { IconDefinition } from '@ant-design/icons-angular';

// Import tất cả icon
import * as AllIcons from '@ant-design/icons-angular/icons';

// Tạo mảng chứa tất cả các icon
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

const NzModules = [
  NzButtonModule,
  NzLayoutModule,
  NzMenuModule,
  NzFormModule,
  NzInputModule,
  NzSelectModule,
  NzTableModule,
  NzCardModule,
  NzModalModule,
  NzNotificationModule,
  NzMessageModule,
  NzDrawerModule,
  NzGridModule,
  NzDividerModule,
  NzSpinModule,
  NzIconModule,
  NzDropDownModule,
  NzBreadCrumbModule,
  NzAlertModule,
  NzAvatarModule,
  NzResultModule,
  NzRadioModule,
  NzCheckboxModule,
  NzDatePickerModule,
  NzBadgeModule,
  NzUploadModule,
  NzEmptyModule,
  NzPaginationModule,
  NzTabsModule,
  NzImageModule
];

@NgModule({
  imports: [...NzModules],
  exports: [...NzModules]
})
export class NgZorroModule { } 