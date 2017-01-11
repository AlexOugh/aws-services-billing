import React from 'react';

const AccountDetail = ({ account, service, current_blended, prev_blended, diff_blended, diff_blended_per, current_unblended, prev_unblended, diff_unblended, diff_unblended_per, cur_last_end_date, prev_last_end_date, cur_year_month, prev_year_month }) => (
  <tr>
  <td>{account}</td>
  <td><a href={`/#/accountServiceDetail?account=${account}&service=${service}&yearMonth=${cur_year_month}&lastEndDate=${cur_last_end_date}`}>{service}</a></td>
  <td>{current_blended}</td>
  <td>{prev_blended}</td>
  <td style={{ background:"#5D7B9D" }}>{diff_blended}</td>
  <td style={{ background:"#00FF00" }}>{diff_blended_per}%</td>
  <td>{current_unblended}</td>
  <td>{prev_unblended}</td>
  <td style={{ background:"#5D7B9D" }}>{diff_unblended}</td>
  <td style={{ background:"#00FF00" }}>{diff_unblended_per}%</td>
  <td>{cur_last_end_date}</td>
  </tr>
);

AccountDetail.propTypes = {
  account: React.PropTypes.string.isRequired,
  service: React.PropTypes.string.isRequired,
  current_blended: React.PropTypes.number.isRequired,
  current_unblended: React.PropTypes.number.isRequired,
  cur_last_end_date: React.PropTypes.string.isRequired,
  prev_last_end_date: React.PropTypes.string.isRequired,
  cur_year_month: React.PropTypes.string.isRequired,
  prev_year_month: React.PropTypes.string.isRequired
};

export default AccountDetail;
