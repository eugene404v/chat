import React from 'react'
import axios from 'axios'

import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

class AsyncSelect extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false
  };

  fetchUser = value => {
    console.log('fetching user', value);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    axios.get(`/${this.props.type}/searchByName?name=${value}`, {
        headers: {
          Accept: "text/json",
        },
      }).then(({data}) => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        const tempData = data.results && data.results.map(user => ({
          text: user.name,
          value: user.id,
        }));
        this.setState({ data: tempData, fetching: false });
      });
      
  };

  handleChange = value => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
    this.props.onSelectHandler(value.value)
  };

  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
      disabled={this.props.disabled}
        showSearch
        labelInValue
        value={value}
        placeholder="Select users"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data && Array.isArray(data) && data.map(d => (
          <Option key={d.value} title={d.text}>{d.text}</Option>
        ))}
      </Select>
    );
  }
}


export default AsyncSelect
