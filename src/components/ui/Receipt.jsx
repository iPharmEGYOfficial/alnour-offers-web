import TaxQrBlock from './TaxQrBlock';
import '../styles/receipt.css';

export default function Receipt({ data }) {
  return (
    <div className='receipt'>

      <div style={{ textAlign: 'center' }}>
        <h3>iPharmEGY</h3>
        <p>?????? ?????</p>
        <p>??? - ????????</p>
        <hr />
      </div>

      <div className='no-break'>
        <p>??? ????????: {data.invoiceNo}</p>
        <p>???????: {data.date}</p>
      </div>

      <hr />

      <div className='no-break'>
        {data.items.map((item, i) => (
          <div key={i}>
            <div>{item.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.qty} x {item.price}</span>
              <span>{item.total}</span>
            </div>
          </div>
        ))}
      </div>

      <hr />

      <div className='no-break'>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>????????</span>
          <span>{data.total}</span>
        </div>
      </div>

      <hr />

      <TaxQrBlock data={data.qr} />

      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        ????? ???????? 
      </p>

    </div>
  );
}

