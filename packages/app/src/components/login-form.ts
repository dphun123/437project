import { LitElement, css, html } from "lit";

function submitLoginForm(event: Event, endpoint: string, redirect: string) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const data = new FormData(form);
  const method = "POST";
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(Object.fromEntries(data));

  fetch(endpoint, { method, headers, body })
    .then((res) => {
      if (res.status !== 200)
        throw `Form submission failed: Status ${res.status}`;
      return res.json();
    })
    .then((payload) => {
      const { token } = payload;

      form.dispatchEvent(
        new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect }],
        })
      );
    })
    .catch((err) => console.log("Error submitting form:", err));
}

export class LoginFormElement extends LitElement {
  handleSubmit(event: Event) {
    const endpoint = this.getAttribute("api");
    const redirect = this.getAttribute("redirect") || "/";

    if (endpoint) submitLoginForm(event, endpoint, redirect);
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <slot name="title">
          <h3>Sign in with Username and Password</h3>
        </slot>
        <label>
          <span>
            <slot name="username">Username</slot>
          </span>
          <input name="username" autocomplete="off" />
        </label>
        <label>
          <span>
            <slot name="password">Password</slot>
          </span>
          <input type="password" name="password" />
        </label>
        <slot name="submit">
          <button type="submit">Sign In</button>
        </slot>
      </form>
    `;
  }

  static styles = css`
    /* TODO: Style the header here */
  `;
}
