'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Transaction {
    _id: string
    type: 'add' | 'withdraw' | 'transfer'
    amount: number
    to?: string
    from?: string
    date: string
}

interface LoadingState {
    fetching: boolean
    generatingPdf: boolean
}

export default function ReceiptPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()

    const [transaction, setTransaction] = useState<Transaction | null>(null)
    const [loading, setLoading] = useState<LoadingState>({
        fetching: true,
        generatingPdf: false
    })
    const [error, setError] = useState<string | null>(null)

    // Memoized formatted values
    const formattedAmount = useMemo(() => {
        return transaction ? `₦${transaction.amount.toLocaleString()}` : ''
    }, [transaction])

    const formattedDate = useMemo(() => {
        return transaction ? new Date(transaction.date).toLocaleString() : ''
    }, [transaction])

    const formattedType = useMemo(() => {
        return transaction ? transaction.type.toUpperCase() : ''
    }, [transaction])

    useEffect(() => {
        if (!id) {
            setError('Invalid transaction ID')
            setLoading(prev => ({ ...prev, fetching: false }))
            return
        }

        const fetchReceipt = async () => {
            try {
                setError(null)
                const res = await fetch(`/api/transactions/receipt?id=${id}`)
                
                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.error || `HTTP ${res.status}`)
                }
                
                const data = await res.json()
                
                // Validate transaction data
                if (!data.transaction || !data.transaction._id) {
                    throw new Error('Invalid transaction data received')
                }
                
                setTransaction(data.transaction)
            } catch (err) {
                console.error('Error fetching receipt:', err)
                setError(err instanceof Error ? err.message : 'Failed to load receipt')
            } finally {
                setLoading(prev => ({ ...prev, fetching: false }))
            }
        }

        fetchReceipt()
    }, [id])

    const handleDownloadPDF = async () => {
    try {
        setLoading(prev => ({ ...prev, generatingPdf: true }))
        setError(null)
        
        const { jsPDF } = await import('jspdf')
        const pdf = new jsPDF()
        const pdfAmount = `NGN ${transaction?.amount.toLocaleString()}`
        
        // Header
        pdf.setFontSize(24)
        pdf.setTextColor(5, 150, 105)
        pdf.text('Payment Receipt', 105, 30, { align: 'center' })
        
        // Divider line
        pdf.setDrawColor(5, 150, 105)
        pdf.setLineWidth(2)
        pdf.line(60, 40, 150, 40)
        
        // Transaction details
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(12)
        
        let y = 60
        pdf.text('Transaction ID:', 30, y)
        pdf.text((`${transaction?._id}`).toString(), 120, y)//it still works dont mind the red line
        
        y += 15
        pdf.text('Type:', 30, y)
        pdf.text(formattedType, 120, y)
        
        y += 15
        pdf.setTextColor(5, 150, 105)
        pdf.setFontSize(14)
        pdf.text('Amount:', 30, y)
        pdf.text(pdfAmount, 120, y)
        
        // Transfer details if applicable
        if (transaction?.type === 'transfer') {
            y += 15
            pdf.setTextColor(0, 0, 0)
            pdf.setFontSize(12)
            pdf.text('From:', 30, y)
            pdf.text(transaction?.from || 'N/A', 120, y)
            
            y += 15
            pdf.text('To:', 30, y)
            pdf.text(transaction?.to || 'N/A', 120, y)
        }
        
        y += 15
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(12)
        pdf.text('Date:', 30, y)
        pdf.text(formattedDate, 120, y)
        
        // Footer
        y += 30
        pdf.setFontSize(10)
        pdf.setTextColor(100, 100, 100)
        pdf.text('Thank you for your transaction!', 105, y, { align: 'center' })
        pdf.text('Keep this receipt for your records.', 105, y + 10, { align: 'center' })
        
        pdf.save(`receipt-${transaction?._id}.pdf`)
        
    } catch (error) {
        console.error('PDF generation failed:', error)
        setError('Failed to generate PDF. Please try again.')
    } finally {
        setLoading(prev => ({ ...prev, generatingPdf: false }))
    }
}

    const handlePrint = () => {
        try {
            window.print()
        } catch (error) {
            console.error('Print failed:', error)
            setError('Failed to print. Please try again.')
        }
    }

    // Loading state
    if (loading.fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
                    <p className="text-lg text-gray-600">Loading receipt...</p>
                </motion.div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div 
                    className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <div className="text-red-600 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
                    <p className="text-red-700 mb-6">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                        ← Go Back
                    </button>
                </motion.div>
            </div>
        )
    }

    // Transaction not found
    if (!transaction) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div 
                    className="text-center bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-md"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <div className="text-yellow-600 text-5xl mb-4">📋</div>
                    <h2 className="text-xl font-bold text-yellow-800 mb-2">Receipt Not Found</h2>
                    <p className="text-yellow-700 mb-6">The requested receipt could not be found.</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                        ← Go Back
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                id="receipt-content"
                className="shadow-2xl rounded-xl p-8 w-full max-w-md"
                style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb'
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧾</div>
                    <h2 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold', 
                        marginBottom: '0.25rem',
                        color: '#059669' 
                    }}>
                        Payment Receipt
                    </h2>
                    <div style={{ 
                        height: '4px', 
                        width: '4rem', 
                        margin: '0 auto', 
                        borderRadius: '2px',
                        backgroundColor: '#059669' 
                    }}></div>
                </div>

                {/* Transaction Details */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #f3f4f6' 
                    }}>
                        <span style={{ fontWeight: '600', color: '#6b7280' }}>Transaction ID:</span>
                        <span style={{ 
                            color: '#111827', 
                            fontFamily: 'monospace', 
                            fontSize: '0.875rem' 
                        }}>{transaction._id}</span>
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #f3f4f6' 
                    }}>
                        <span style={{ fontWeight: '600', color: '#6b7280' }}>Type:</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{formattedType}</span>
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #f3f4f6' 
                    }}>
                        <span style={{ fontWeight: '600', color: '#6b7280' }}>Amount:</span>
                        <span style={{ 
                            fontWeight: 'bold', 
                            fontSize: '1.125rem', 
                            color: '#059669' 
                        }}>{formattedAmount}</span>
                    </div>
                    
                    {transaction.type === 'transfer' && (
                        <>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                padding: '0.5rem 0',
                                borderBottom: '1px solid #f3f4f6' 
                            }}>
                                <span style={{ fontWeight: '600', color: '#6b7280' }}>From:</span>
                                <span style={{ color: '#111827' }}>{transaction.from || 'N/A'}</span>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                padding: '0.5rem 0',
                                borderBottom: '1px solid #f3f4f6' 
                            }}>
                                <span style={{ fontWeight: '600', color: '#6b7280' }}>To:</span>
                                <span style={{ color: '#111827' }}>{transaction.to || 'N/A'}</span>
                            </div>
                        </>
                    )}
                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #f3f4f6' 
                    }}>
                        <span style={{ fontWeight: '600', color: '#6b7280' }}>Date:</span>
                        <span style={{ color: '#111827' }}>{formattedDate}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={loading.generatingPdf}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: loading.generatingPdf ? 'not-allowed' : 'pointer',
                            backgroundColor: loading.generatingPdf ? '#86efac' : '#059669',
                            color: '#ffffff',
                            border: 'none',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading.generatingPdf) {
                                e.currentTarget.style.backgroundColor = '#047857'
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading.generatingPdf) {
                                e.currentTarget.style.backgroundColor = '#059669'
                            }
                        }}
                    >
                        {loading.generatingPdf ? (
                            <>
                                <div style={{
                                    display: 'inline-block',
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid transparent',
                                    borderTop: '2px solid #ffffff',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    marginRight: '8px'
                                }}></div>
                                Generating PDF...
                            </>
                        ) : (
                            '📄 Download as PDF'
                        )}
                    </button>

                    <button
                        onClick={handlePrint}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            backgroundColor: '#4b5563',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                    >
                        🖨️ Print Receipt
                    </button>

                    <button
                        onClick={() => router.back()}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    >
                        ← Back
                    </button>
                </div>

                {/* Footer */}
                <div style={{ 
                    textAlign: 'center', 
                    fontSize: '0.75rem', 
                    marginTop: '1.5rem', 
                    paddingTop: '1rem',
                    borderTop: '1px solid #f3f4f6', 
                    color: '#6b7280' 
                }}>
                    <p>Thank you for your transaction!</p>
                    <p style={{ marginTop: '0.25rem' }}>Keep this receipt for your records.</p>
                </div>
            </motion.div>
        </div>
    )
}