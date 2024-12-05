import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { userRoutes } from './user.routes';
import { ApiTestComponent } from './components/api-test/api-test.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ApiTestComponent],
  imports: [CommonModule, RouterModule.forChild(userRoutes)],
})
export class UserModule {}
