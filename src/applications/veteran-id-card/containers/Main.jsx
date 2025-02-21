import React from 'react';
import { connect } from 'react-redux';
import { has, head } from 'lodash';
import EmailVICHelp from 'platform/static-data/EmailVICHelp';
import { initiateIdRequest, timeoutRedirect } from '../actions';
import config from '../config';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.renderVicForm = this.renderVicForm.bind(this);
  }

  componentDidUpdate() {
    if (this.props.vicUrl) {
      document.getElementById('vicForm').submit();
      setTimeout(this.props.timeoutRedirect, 10000);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.initiateIdRequest();
  }

  renderVicForm() {
    return (
      <div>
        {!!this.props.vicUrl && (
          <form id="vicForm" method="POST" action={this.props.vicUrl}>
            {Object.entries(this.props.traits).map(([key, value]) => (
              <input type="hidden" name={key} key={key} value={value} />
            ))}
          </form>
        )}
      </div>
    );
  }

  renderButton() {
    if ((this.props.fetching || this.props.vicUrl) && !this.props.vicError) {
      return (
        <va-button disabled onClick={this.handleSubmit} text="Redirecting..." />
      );
    }
    return (
      <va-button onClick={this.handleSubmit} text="Request a Veteran ID card" />
    );
  }

  renderVicError() {
    const content = (
      <p>
        Please refresh the page or try again later. You can also{' '}
        <EmailVICHelp />
      </p>
    );

    return (
      <va-alert visible status="error">
        <h4 slot="headline">
          We’re sorry. Something went wrong when loading the page.
        </h4>
        {content}
      </va-alert>
    );
  }

  renderErrors() {
    const { errors } = this.props;
    const { code } = head(errors);
    const detail = has(config.messages, code)
      ? config.messages[code]
      : config.messages.default;
    return (
      <va-alert visible status="error">
        <h4 slot="headline">We can't process your request</h4>
        {detail}
      </va-alert>
    );
  }

  render() {
    let message;

    if (this.props.errors) {
      message = this.renderErrors();
    }

    const view = (
      <div className="row">
        <div className="usa-width-two-thirds medium-8 vet-id-card">
          <h1>Veteran ID Card</h1>
          <p>
            You can use your Veteran ID Card (VIC) instead of your DD214 to get
            discounts on goods and services offered to Veterans. You can also
            use other identification cards for this purpose. Find out if you
            need a VIC or if you already have what you need.
          </p>
          <h3>Should I request a Veteran ID card?</h3>
          <p>
            You <b>do not</b> need to request this card if you have one of
            these:
          </p>
          <ul>
            <li>
              Veterans Health Identification Card (VHIC), <b>or</b>
            </li>
            <li>
              Department of Defense Identification Card&#8212;either a Common
              Access Card (CAC) or a Uniformed Services ID Card, <b>or</b>
            </li>
            <li>
              State-issued ID (driver’s license) with a Veteran designation or a
              state-issued Veteran ID Card. Check with your state to see if they
              issue Veteran ID Cards.
            </li>
          </ul>
          <p>
            You can use any of these cards to get the same discounts. If you
            already have one of them, you don’t need a VIC, but you can still
            apply for it if you’d like.
          </p>
          <p>
            If you don’t have one of these cards, you should request a Veteran
            ID Card.
          </p>
          <h3>Ready to request a Veteran ID Card?</h3>
          <p>
            You can request your card online now—or check the status of your
            request.{' '}
          </p>
          <p>
            <strong>Note:</strong> To continue, you’ll need a government-issued
            ID (like your driver’s license) and a photo of yourself from the
            shoulders up. Make sure you have what you need for this next step.
          </p>
          <div>
            {this.renderButton()}
            <div>{message}</div>
            {this.props.vicError && this.renderVicError()}
          </div>
          {this.renderVicForm()}
        </div>
      </div>
    );

    return <div>{view}</div>;
  }
}

const mapStateToProps = state => {
  const idState = state.idcard;
  const userState = state.user;
  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl,
    vicUrl: idState.idcard.vicUrl,
    traits: idState.idcard.traits,
    fetching: idState.idcard.fetching,
    errors: idState.idcard.errors,
  };
};

const mapDispatchToProps = {
  initiateIdRequest,
  timeoutRedirect,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
export { Main };
