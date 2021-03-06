import * as React from 'react';
import Timer from './Timer';
import UserOptions from './UserOptions';
import Messages from './Messages';
import { toString } from 'lodash';

interface ITimedOptionsProps {
  onTimeout: (results: number[]) => void;
  onClear: () => void;
}

interface ITimedOptionsState {
  seconds: number;
  isMute: boolean;
  votes: number[];
}

class TimedOptions extends React.Component<ITimedOptionsProps, ITimedOptionsState> {
  constructor() {
    super();
    this.state = TimedOptionsStates.getInitialState({ seconds: 0, isMute: false, votes: []}, {});
  }

  componentDidMount() {
    // TODO deregister timeout when seconds === 0
    const currentTime = this.state.seconds || 10;
    this.setState(TimedOptionsStates.getInitialState);

    setInterval(() => {
      let currentTimeLeft;
      if (!this.state.seconds) {
        currentTimeLeft = 0;
      } else {
        currentTimeLeft = this.state.seconds - 1;
      }
      this.setState(TimedOptionsStates.updateTime(currentTimeLeft));
      this.handleTimeout();
    }, 1000);
  }

  private handleTimeout() {
    if (!this.state.seconds) {
      this.setState(TimedOptionsStates.enableMute);
      this.props.onTimeout(this.state.votes);
    }
  }

  private handleRestart() {
    this.setState(TimedOptionsStates.getInitialState);
    this.props.onClear();
  }

  private handleSelect(num: number) {
    this.setState(TimedOptionsStates.addOption(num));
  }


  render() {
    return (
      <div>
        <Timer seconds={this.state.seconds} restart={this.handleRestart.bind(this)}/>
        <UserOptions options={VoteOptions.values} mute={this.state.isMute} selectOption={this.handleSelect.bind(this)} />
        <Messages messages={this.state.votes.map(toString)} />
      </div>
    );
  }
}

class VoteOptions {
  public static values = [0.5, 1, 2, 3, 5];
  public static COUNTDOWN_TIME = 10;
}

class TimedOptionsStates {
  static updateTime(seconds: number) {
    return s => Object.assign({}, s, { seconds });
  }
  static addOption(option: number) {
    return s => Object.assign({}, s, {
        votes: [...s.votes, option],
      });
  }
  static enableMute(s, p): ITimedOptionsState {
    return Object.assign({}, s, { isMute: true, });
  }
  static getInitialState(s: ITimedOptionsState, p): ITimedOptionsState {
    return Object.assign({}, s, {
        seconds: VoteOptions.COUNTDOWN_TIME,
        isMute: false,
        votes: [],
    });
  }
}

export default TimedOptions;