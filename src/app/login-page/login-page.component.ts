import { Component,NgModule,OnInit,ElementRef, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { LoginPageService } from '../shared/login-page.service';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from '../app.routes';
import { MessagesThemesModel, MessagesModel } from '../shared/login-page.model';



interface CaptchaFigure {
  type: string;
  x: number;
  y: number;
  size: number;
  offsetX: number;
  offsetY: number;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styles: ``,
  animations: [],
})

export class LoginPageComponent implements OnInit {

  figures: CaptchaFigure[] = [
    { type: 'circle', x: 10, y: 20, size: 30, offsetX: -10, offsetY:0 },
    { type: 'square', x: 50, y: 60, size: 40, offsetX: 0, offsetY:0 },
    { type: 'triangle', x: Math.floor(Math.random() * 20) - 10, y: Math.floor(Math.random() * 20) - 10, size: Math.floor(Math.random() * 20) - 10, offsetX: Math.floor(Math.random() * 200) - 10, offsetY:Math.floor(Math.random() * 200) - 10},
  ];

  themes: MessagesThemesModel[] = [];
  private mesTheme = "";
  clientFormVisible = false;

  client: any = {
    name: '',
    email: '',
    phoneNumber: '',
    messages: []
  };

  @ViewChildren('captchaLetter') captchaLetters: QueryList<ElementRef>;
  @ViewChildren('captchaFigure') captchaFigure: QueryList<ElementRef>;

  constructor(public service: LoginPageService,private cdRef: ChangeDetectorRef, private renderer: Renderer2)
  {
    this.captchaLetters = new QueryList<ElementRef>();
    this.captchaFigure = new QueryList<ElementRef>();
  }

  ngOnInit(): void {
    this.service.refreshList();
    this.service.captUpdator();
    this.service.getMessageThemes().subscribe(themes => {
      this.themes = themes;
    });
  }

  updateCaptcha()
  {
    this.service.captUpdator();
    this.generateFigures();
    this.cdRef.detectChanges();
    this.ngAfterViewInit();
  }

  ngAfterViewInit(): void {
    this.animations();
  }

  animations()
  {
    this.animateLetters();
    this.animateFigures();
  }

  generateFigures(): void {
    this.figures = [];
    const figureTypes = ['circle', 'square', 'triangle'];
    const figureCount = Math.floor(Math.random() * 5) + 1; // случайное количество фигурок
    for (let i = 0; i < figureCount; i++) {
      const figureType = figureTypes[Math.floor(Math.random() * figureTypes.length)];
      const x = Math.floor(Math.random() * 100); // случайная координата x
      const y = Math.floor(Math.random() * 100); // случайная координата y
      const size = Math.floor(Math.random() * 50) + 10; // случайный размер
      const offsetX = Math.floor(Math.random() * 20) - 10; // случайный отступ по x (-10 до 10)
      const offsetY = Math.floor(Math.random() * 20) - 10; // случайный отступ по y (-10 до 10)
      this.figures.push({ type: figureType, x, y, size, offsetX, offsetY });
    }
  }

  getFigureClass(type: string): string {
    return type;
  }

  animateLetters()
  {
      this.captchaLetters.forEach(letter => {
      const element = letter.nativeElement;
      let posY = Math.random() * 10;
      let rotate = Math.random() * 45;
      let animationDuration = 2000;
      let startTime = performance.now();
      function animate() {
        const currentTime = performance.now();
        const progress = (currentTime - startTime) / animationDuration;
        const oscillation = Math.sin(progress * Math.PI * 2);
        posY = oscillation * 10;
        rotate = oscillation * 15;
        element.style.transform = `translateY(${posY}px) rotate(${rotate}deg)`;

      requestAnimationFrame(animate);
    }
      animate();
    });
  }

  animateFigures() {
    this.captchaFigure.forEach(figure => {
      const element = figure.nativeElement; {
      let posX = Math.random() * 100;
      let posY = Math.random() * 100;
      let rotate = Math.random() * 360;
      let animationDuration = 5000; // 2 sec
      let startTime = performance.now();
      function animate() {
        const currentTime = performance.now();
        const progress = (currentTime - startTime) / animationDuration;
        const oscillationX = Math.sin(progress * Math.PI * 2);
        const oscillationY = Math.sin(progress * Math.PI * 2 + Math.PI / 2);
        posX = oscillationX * 200;
        posY = oscillationY * 10;
        rotate = oscillationX * 360;

        element.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotate}deg)`;

        requestAnimationFrame(animate);
      }
      animate();
    }});
  }

  onInputChange(event: any) {
    this.mesTheme = event.target.value;
  }

  onSubmit(form:NgForm)
  {
    if(this.clientFormVisible == false)
    {

    this.service.formSubmitted = true;
    if (form.valid)
    {
      const check = this.renderer.selectRootElement('#captchainput');
      if (this.service.cptch == check.value)
      {
        const phoneNumber = form.value.phoneNumber;
        const email = form.value.email;
        const name = form.value.name;
        const message = form.value.message_Text;
        const thistheme = (this.service.formData2.messageTheme as unknown as { messageTheme: string }).messageTheme;
        let contactID = 0;
        let messageThemeID = 0;

        this.service.existanceChecker(phoneNumber, email).subscribe(exists => {

          if (exists)
          {
            contactID = (exists as unknown as { contact_ID: number }).contact_ID;

            this.client =
            {
              name: (exists as unknown as {name: string}).name,
              email: (exists as unknown as {email: string}).email,
              phoneNumber: (exists as unknown as {phoneNumber: string}).phoneNumber,
            };

            this.service.getMessage(contactID).subscribe(messages => {
              this.client.messages = messages;
            });

            this.service.mtChecker(thistheme).subscribe(exist => {

              if (exist)
              {
                messageThemeID = (exist as unknown as { mT_ID: number }).mT_ID;

                const newMessage = {
                  message_Text: message,
                  client_Id: contactID.toString(),
                  theme_Id: messageThemeID.toString()
                };

                this.service.postMessage(newMessage).subscribe({
                  next: res => {
                    console.log(res);
                  },
                  error: err => { console.log(err) }
                });
              }
              else
              {
                this.service.mtChecker(this.mesTheme).subscribe(exis => {
                  if (exis)
                    {
                      messageThemeID = (exis as unknown as { mT_ID: number }).mT_ID;

                      const newMessage = {
                        message_Text: message,
                        client_Id: contactID.toString(),
                        theme_Id: messageThemeID.toString()
                      };

                      this.service.postMessage(newMessage).subscribe({
                        next: res => {
                          console.log(res);
                        },
                        error: err => { console.log(err) }
                      });
                    }
                  else
                    {
                      const newTheme = { messageTheme: this.mesTheme }

                      this.service.postMessageTheme(newTheme).subscribe({
                        next: res => {
                          messageThemeID = (res as { mT_ID: number }).mT_ID;
                          console.log(res);

                            const newMessage = {
                              message_Text: message,
                              client_Id: contactID.toString(),
                              theme_Id: messageThemeID.toString()
                            };

                            this.service.postMessage(newMessage).subscribe({
                              next: res => {
                                console.log(res);
                              },
                              error: err => { console.log(err) }
                            });
                          },
                          error: err => { console.log(err) }
                        });
                      }
                    }
                  )
                }
              }
            )
          }
          else
          {
            const newContact = {
              phoneNumber: phoneNumber,
              email: email,
              name: name,
            };

          this.service.postContact(newContact).subscribe({
            next: res => {
              contactID = (res as { contact_ID: number }).contact_ID;
              console.log(res);

              this.service.mtChecker(thistheme).subscribe(exist => {
                if (exist)
                {
                  messageThemeID = (exist as unknown as { mT_ID: number }).mT_ID;

                  const newMessage = {
                    message_Text: message,
                    client_Id: contactID.toString(),
                    theme_Id: messageThemeID.toString()
                  };

                  this.service.postMessage(newMessage).subscribe({
                    next: res => {
                      console.log(res);
                    },
                    error: err => { console.log(err) }
                  });
                }
                else
                {
                  this.service.mtChecker(this.mesTheme).subscribe(exis => {
                    if (exis)
                      {
                        messageThemeID = (exis as unknown as { mT_ID: number }).mT_ID;

                        const newMessage = {
                          message_Text: message,
                          client_Id: contactID.toString(),
                          theme_Id: messageThemeID.toString()
                        };

                        this.service.postMessage(newMessage).subscribe({
                          next: res => {
                            console.log(res);
                          },
                          error: err => { console.log(err) }
                        });
                      }

                    else
                      {
                        const newTheme = { messageTheme: this.mesTheme }

                          this.service.postMessageTheme(newTheme).subscribe({
                            next: res => {
                              messageThemeID = (res as { mT_ID: number }).mT_ID;
                              console.log(res);

                                const newMessage = {
                                  message_Text: message,
                                  client_Id: contactID.toString(),
                                  theme_Id: messageThemeID.toString()
                                };

                                this.service.postMessage(newMessage).subscribe({
                                  next: res => {
                                    console.log(res);
                                  },
                                  error: err => { console.log(err) }
                                });
                              },
                              error: err => { console.log(err) }
                          });
                        }
                      }
                    )
                  }
                }
              )
              this.client =
              {
                name: name,
                email: email,
                phoneNumber: phoneNumber,
              };
              this.service.getMessage(contactID).subscribe(messages => {
                this.client.messages = messages;
              });
            },
            error: err => { console.log(err) }
          });
        }
      });
      this.clientFormVisible = true;
      this.service.resetForm(form);
      }
      else
        {
          alert("капча пройдена неверно!");
        }
      }
    }
  else
    {
      this.clientFormVisible = false;
      this.updateCaptcha();
    }
  }
}
