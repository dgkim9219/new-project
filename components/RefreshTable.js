import React from 'react';

class RefreshTable extends React.Component {
  handleClick = () => {
    fetch('/api/refreshTable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      // 서버에서 받은 응답 처리
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  render() {
    return (
      <button onClick={this.handleClick}>DB연동</button>
    );
  }
}

export default RefreshTable;
