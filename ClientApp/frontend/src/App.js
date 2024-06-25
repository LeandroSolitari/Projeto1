import React, { useState, useEffect } from 'react';

const App = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCustomerId, setCurrentCustomerId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://localhost:44300/api/Customers');
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const jsonData = await response.json();
            console.log('Fetched data:', jsonData);
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://localhost:44300/api/Customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: 0,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber
                })
            });
            if (!response.ok) {
                throw new Error(`Failed to add customer: ${response.statusText}`);
            }
            const addedCustomer = await response.json();
            console.log('Added customer:', addedCustomer);
            fetchData();
            setShowModal(false);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: ''
            });
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const handleUpdate = async () => {
        const updatedData = {
            Id: currentCustomerId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber
        };
        try {
            const response = await fetch(`https://localhost:44300/api/Customers/${currentCustomerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) {
                throw new Error(`Failed to update customer: ${response.statusText}`);
            }

            // Verificar se a resposta não está vazia antes de tentar converter para JSON
            const text = await response.text();
            const updatedCustomer = text ? JSON.parse(text) : {}; // Converter apenas se houver conteúdo

            console.log('Updated customer:', updatedCustomer);
            fetchData(); // Atualizar a lista de clientes
            setShowModal(false); // Fechar o modal de edição
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: ''
            });
            setEditMode(false);
            setCurrentCustomerId(null);
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };



    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Tem certeza que deseja deletar este cliente?');
        if (confirmDelete) {
            try {
                const response = await fetch(`https://localhost:44300/api/Customers/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error(`Failed to delete customer: ${response.statusText}`);
                }
                console.log(`Deleted customer with id: ${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };

    const handleEdit = (customer) => {
        setFormData({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phoneNumber: customer.phoneNumber
        });
        setCurrentCustomerId(customer.id);
        setEditMode(true);
        setShowModal(true);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <style>
                {`
                    .tooltip {
                        position: relative;
                        display: inline-block;
                        cursor: pointer;
                    }

                    .tooltip .tooltiptext {
                        visibility: hidden;
                        width: 160px;
                        background-color: black;
                        color: #fff;
                        text-align: center;
                        border-radius: 6px;
                        padding: 5px 0;
                        position: absolute;
                        z-index: 1;
                        bottom: 125%; /* Posiciona acima do texto */
                        left: 50%;
                        margin-left: -80px; /* Centraliza a tooltip */
                        opacity: 0;
                        transition: opacity 0.3s;
                    }

                    .tooltip:hover .tooltiptext {
                        visibility: visible;
                        opacity: 1;
                    }
                `}
            </style>
            {loading ? (
                <p>Carregando...</p>
            ) : (
                data !== null && data.length > 0 ? (
                    <table style={{ width: '60%', margin: 'auto', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <td colSpan="4"><h1>Lista de Clientes</h1></td>
                            </tr>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(customer => (
                                <tr key={customer.id}>
                                    <td>{customer.firstName} {customer.lastName}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phoneNumber}</td>
                                    <td>
                                        <button onClick={() => handleEdit(customer)}>Editar</button>
                                        <button onClick={() => handleDelete(customer.id)}>Deletar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhum cliente encontrado.</p>
                )
            )}
            <button onClick={() => {
                setShowModal(true);
                setEditMode(false);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: ''
                });
            }} style={{ margin: '20px', padding: '10px 20px' }}>Adicionar Cliente</button>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '300px'
                    }}>
                        <h2>{editMode ? 'Editar Cliente' : 'Adicionar Cliente'}</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (editMode) {
                                handleUpdate();
                            } else {
                                handleSubmit();
                            }
                        }}>
                            <div>
                                <label>Nome:</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label>Sobrenome:</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label>Telefone:</label>
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <button type="submit" style={{ marginRight: '10px', padding: '5px 10px' }}>
                                    {editMode ? 'Atualizar' : 'Salvar'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '5px 10px' }}>Fechar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
