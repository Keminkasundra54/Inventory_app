import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  @Output() cancelModal = new EventEmitter<boolean>();

  userId: string = ''
  notifications: any = []
  selectedNoti: any = []
  constructor(private noti: NotificationService) {
    if (localStorage.getItem('userData')) {
      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
    }
  }

  ngOnInit() {
    this.getUserNotification()

  }

  cancel() {
    this.cancelModal.emit(true)
    // this.modal.dismiss(null, 'cancel');
  }

  getUserNotification() {
    let obj = {
      userId: this.userId
    }
    this.noti.getUserNotification(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.notifications = res.body.data
          const groupedNotifications = this.groupNotificationsByDate(this.notifications);
          this.notifications = Object.keys(groupedNotifications).map(dateLabel => ({
            dateLabel,
            notifications: groupedNotifications[dateLabel]
          }));
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  groupNotificationsByDate(notifications: any[]): { [key: string]: any[] } {
    const grouped: { [key: string]: any[] } = {};
    notifications.forEach(noti => {
      const createdAtDate = new Date(noti.createdAt);
      const currentDate = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      let dateLabel;

      if (this.isSameDate(createdAtDate, currentDate)) {
        dateLabel = 'Today';
      } else if (this.isSameDate(createdAtDate, yesterday)) {
        dateLabel = 'Yesterday';
      } else {
        dateLabel = this.formatDate(createdAtDate);
      }

      if (!grouped[dateLabel]) {
        grouped[dateLabel] = [];
      }
      grouped[dateLabel].push(noti);
    });
    return grouped;
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }



  read(id: any) {
    console.log('resss');
    let obj = {
      notificationId: id,
      read: 'true'
    }
    this.noti.updateNoti(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.getUserNotification()
        }
      },
      error: (err) => {
        console.error(err);

      }
    })

  }
  unread(id: any) {
    console.log('resss');
    let obj = {
      notificationId: id,
      read: 'false'
    }
    this.noti.updateNoti(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.getUserNotification()
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  delete(id: any) {
    console.log('resss');
    let obj = {
      notificationId: id,
    }
    this.noti.delete(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.getUserNotification()
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }


}
