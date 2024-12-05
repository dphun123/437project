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
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    span {
      color: var(--color-text);
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 1rem;
    }

    input:focus {
      outline: none;
      border-color: var(--color-link);
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    button {
      padding: 0.75rem;
      background-color: var(--color-background-header);
      color: var(--color-background-page);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: var(--color-link);
    }
  `;
}
