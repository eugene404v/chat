import React from 'react'
import {Link} from 'react-router-dom'

import Pair from "./Pair";

function PairLink(props) {
  
    return (
      <Pair descr={props.descr}>
        <Link to={props.link}>{props.text}</Link>
      </Pair>
    );
  }

export default PairLink
