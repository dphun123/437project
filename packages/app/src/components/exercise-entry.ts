// import { Auth, Observer } from "@calpoly/mustang";
// import { LitElement, css, html } from "lit";
// import { state } from "lit/decorators.js";
// import { Entry } from "server/models";

// export class EntryElement extends LitElement {
//   @state()
//   entry?: Entry;

//   get src() {
//     return this.getAttribute("src");
//   }

//   get ref() {
//     return this.getAttribute("ref");
//   }

//   render() {
//     return html`
//       <section class="exercise">
//         <dt>
//           <a><slot>Exercise</slot></a>
//         </dt>
//         <dd>
//           <ul>
//             <slot name="entries">No entries yet</slot>
//           </ul>
//         </dd>
//       </section>
//     `;
//   }

//   static styles = css`
//     .exercise {
//       --page-grids: 2;

//       display: grid;
//       grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];

//       > dt {
//         grid-column: start / end;
//       }
//       > dd {
//         grid-column: start / span 1;
//       }
//     }
//     a {
//       color: var(--color-link);
//     }
//     dt {
//       font-weight: var(--font-weight-darker);
//       font-size: var(--size-type-medium);
//     }
//   `;

//   get authorization() {
//     console.log("Authorization for user, ", this._user);
//     if (this._user && this._user.authenticated)
//       return {
//         Authorization: `Bearer ${this._user.token}`,
//       };
//     else return {};
//   }

//   constructor() {
//     super();
//   }

//   _authObserver = new Observer<Auth.Model>(this, "log:auth");
//   _user = new Auth.User();
//   connectedCallback() {
//     super.connectedCallback();
//     this._authObserver.observe(({ user }) => {
//       if (user) {
//         this._user = user;
//       }
//       // this.hydrate(this.src);
//     });

//     if (this.ref) {
//       const exercise = this.shadowRoot?.querySelector(
//         "dt a"
//       ) as HTMLAnchorElement;
//       if (exercise) {
//         exercise.href = `/exercise/${this.ref}`;
//       }
//     }
//   }

//   hydrate(url: string) {
//     fetch(url, { headers: this.authorization })
//       .then((res) => {
//         if (res.status !== 200) throw `Status: ${res.status}`;
//         return res.json();
//       })
//       .then((json) => this.renderSlots(json))
//       .catch((error) => console.log(`Failed to render data ${url}:`, error));
//   }

//   renderSlots(json: Record<string, any>) {
//     const entries = Object.entries(json);
//     if (entries.length === 0) return;
//     const toSlot = (entries: [string, any][]) => {
//       return html`
//         <span slot="entries">
//           ${entries.map(
//             ([key, entry]) => html`
//               <li>
//                 <a href="/entry/${entry._id}">Entry #${Number(key) + 1}</a>
//               </li>
//             `
//           )}
//         </span>
//       `;
//     };
//     const fragment = [toSlot(entries)];
//     this.append(...fragment);
//   }
// }
