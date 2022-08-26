import { useEffect } from "react";
import { CounterPresenter } from "./Counter.presenter";
import { store, useCounter, useCounterAction } from "./Counter.state";

export const Counter: React.FC = () => {
  const { counter, multiplied } = useCounter();
  const { increment, incrementAsync, update } = useCounterAction();

  // update count on mount
  // useEffect(() => {
  //   store.setState((s) => {
  //     return {
  //       counter: s.counter + 10
  //     };
  //   });
  // }, []);

  // same here. store instance is also subscribed.
  // useEffect(() => {
  //   update(30);
  // }, []);

  return (
    <CounterPresenter
      counter={counter}
      multiplied={multiplied}
      onClickPlus={increment}
      onClickPlusAsync={incrementAsync}
    />
  );
};
