import React from "react";
import Pair from "./Pair";

function PairUl(props) {
  const renderedArray =
    props.data &&
    props.data.map((el, i) => {
      return <li className="pair__li" key={i + "" + Math.random()}>{el.text}</li>;
    });

  return (
    <Pair descr={props.descr}>
      <ul className="pair__ul">{renderedArray}</ul>
    </Pair>
  );
}

export default PairUl;
