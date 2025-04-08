import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMailFor, setSendingMailFor] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/get-users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMail = async (user) => {
    if (!user.mail) return alert('User email is missing.');
    if (user.rowIndex === undefined) return alert('Row index not found for the user.');

    try {
      setSendingMailFor(user.mail);
      await axios.post('http://localhost:3000/send-mail', {
        email: user.mail,
        name: user.name,
        rowIndex: user.rowIndex,
      });
      alert(`Mail sent to ${user.name}`);
      const response = await axios.get('http://localhost:3000/get-users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error sending mail:', error);
      alert('Failed to send mail.');
    } finally {
      setSendingMailFor(null);
    }
  };

  // Count values
  const totalSent = filteredUsers.filter((user) => user.mailSent === 'SENT');
  const totalCash = totalSent.filter(
    (user) =>
      user.transactionId?.toUpperCase().includes('CASH') ||
      user.transaction_id?.toUpperCase().includes('CASH')
  );
  const totalUPI = totalSent.length - totalCash.length;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', color: '#333', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#FF9800', textAlign: 'center' }}>Admin Panel</h1>

      <input
        type="text"
        placeholder="Search by name, email, or transaction ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: '20px',
          padding: '10px',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #ddd',
          backgroundColor: '#fff',
          color: '#333',
          borderRadius: '5px',
          display: 'block',
          margin: '0 auto',
        }}
      />

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading users...</p>
      ) : (
        <div>
          {/* Sent Mail Section */}
          <h2 style={{ color: '#4CAF50', textAlign: 'center' }}>Users Who Have Sent Messages</h2>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'scroll',
              overflowX: 'auto',
              border: '1px solid #ddd',
              borderRadius: '5px',
              marginBottom: '20px',
            }}
          >
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }} border="1">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mail</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {totalSent.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.mail}</td>
                    <td>{user.transactionId || user.transaction_id || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Tickets Section */}
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              gap: '50px',
              marginBottom: '30px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h3 style={{ color: '#4CAF50' }}>Total Tickets Sold</h3>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{totalSent.length}</p>
            </div>
            <div>
              <h3 style={{ color: '#4CAF50' }}>Total Tickets (Cash)</h3>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{totalCash.length}</p>
            </div>
            <div>
              <h3 style={{ color: '#4CAF50' }}>Total Tickets (UPI)</h3>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{totalUPI}</p>
            </div>
          </div>

          {/* Not Sent Mail Section */}
          <h2 style={{ color: '#f44336', textAlign: 'center' }}>Users Who Have Not Sent Messages</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mail</th>
                  <th>Transaction ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers
                  .filter((user) => user.mailSent !== 'SENT')
                  .map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.mail}</td>
                      <td>{user.transactionId || user.transaction_id || 'N/A'}</td>
                      <td>
                        <button
                          onClick={() => handleSendMail(user)}
                          disabled={sendingMailFor === user.mail}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: sendingMailFor === user.mail ? '#ccc' : '#f44336',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: sendingMailFor === user.mail ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {sendingMailFor === user.mail ? 'Sending...' : 'Send Mail'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
