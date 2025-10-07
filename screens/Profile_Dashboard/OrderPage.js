import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Linking } from 'react-native';
import Layout from '../../components/Layout/_layout';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getMyAllOrder, handleBillStatusChange } from '../../utils/api/Api';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '../../colors/Colors';
import axios from 'axios';

const OrderStatusColors = {
    'Service Done': '#059669',
    'Pending': '#D97706',
    'Cancelled': '#DC2626',
};

const PaymentStatusColors = {
    'paid': '#059669',
    'pending': '#D97706',
    'failed': '#DC2626',
};

const OrderCard = ({ order, refreshControl }) => {
    const [expanded, setExpanded] = useState(false);
    // console.log("i am error",order?.errorCode)
    const handleAcceptBill = async (status, id) => {
        const data = await handleBillStatusChange({ status: status, billId: id });
        if (data === "Bill approved successfully! Please Wait Our Vendor Call You Shortly") {
            refreshControl();
        }
    };

    const getStatusColor = (status) => OrderStatusColors[status] || '#6B7280';
    const getPaymentStatusColor = (status) => PaymentStatusColors[status] || '#6B7280';

    const PayMoney = async () => {
        console.log("I am Hit Order", order);

        if (!order?._id) {
            console.log('Order ID is missing');
            Alert.alert('Error', 'Order ID is missing.');
            return;
        }

        try {
            const response = await axios.post(`https://www.api.blueaceindia.com/api/v1/create-bill-payment-app/${order._id}`, { totalAmount: order.EstimatedBill.EstimatedTotalPrice });

            console.log('Success:', response.data.success);
            console.log('Payment URL:', response.data.url);

            if (response.data.success) {
                Linking.openURL(response.data.url);
            } else {
                Alert.alert('Payment Error', 'Failed to initiate payment.');
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            Alert.alert('Payment Error', 'An error occurred while processing the payment. Please try again.');
        }
    };

    const handleServiceDone = async (id) => {
        try {
            const response = await axios.put(`https://www.api.blueaceindia.com/api/v1/update-service-done-order/${id}`);
            if (response.data.success) {
                alert('Service marked as done successfully')
                refreshControl();
                // toast.success('Service marked as done successfully');
                // window.location.reload();
            }
        } catch (error) {
            console.log('Internal server error in service done', error);
        }
    }



    return (
        <View style={styles.card}>

            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.orderId}>Order #{order._id.slice(-8)}</Text>
                    <Text style={styles.date}>
                        {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.OrderStatus) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(order.OrderStatus) }]}>
                        {order.OrderStatus}
                    </Text>
                </View>
            </View>

            <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>{order.serviceType}</Text>
                {order.totalAmount && (
                    <View style={styles.infoRow}>
                        <Icon name='currency-rupee' size={16} color="#4B5563" />
                        <Text style={styles.infoText}>₹{order.totalAmount}</Text>
                    </View>
                )}

            </View>

            {order.PaymentStatus && (
                <View style={[styles.paymentStatus, { backgroundColor: getPaymentStatusColor(order.PaymentStatus) + '20' }]}>
                    <Text style={[styles.paymentText, { color: getPaymentStatusColor(order.PaymentStatus) }]}>
                        Payment: {order.PaymentStatus}
                    </Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.expandButton}
                onPress={() => setExpanded(!expanded)}
            >
                <Text style={styles.expandText}>
                    {expanded ? 'Show Less' : 'Show More'}
                </Text>
                <Icon
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#4F46E5"
                />
            </TouchableOpacity>

            {expanded && (
                <View style={styles.expandedContent}>

                    <View style={styles.detailSection}>
                        <View style={styles.detailHeader}>
                            <Icon name="map-marker" size={16} color="#4B5563" />
                            <Text style={styles.detailTitle}>Delivery Address</Text>
                        </View>
                        <Text style={styles.detailText}>
                            {order.houseNo}, {order.address}
                            {order.nearByLandMark && `\nLandmark: ${order.nearByLandMark}`}
                            {order.pinCode && `\nPIN: ${order.pinCode}`}
                        </Text>
                    </View>

                    {order.VendorAllotedBoolean === true && (
                        <View style={styles.detailSection}>
                            <View style={styles.detailHeader}>
                                <Icon name="calendar-outline" size={16} color="#4B5563" />
                                <Text style={styles.detailTitle}>Schedule</Text>
                            </View>
                            <View style={styles.scheduleInfo}>
                                <Text style={styles.detailText}>Day: {order.workingDay}</Text>
                                <Text style={styles.detailText}>Time: {order.workingTime}</Text>
                                {order.VendorAllotedTime && (
                                    <Text style={styles.detailText}>
                                        Vendor Alloted Time: {order.VendorAllotedTime}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}

                    {Array.isArray(order.errorCode) && order.errorCode.length > 0 && (
                        <View style={styles.detailSection}>
                            <View style={styles.detailHeader}>
                                <Icon name="block-helper" size={16} color="#4B5563" />
                                <Text style={styles.detailTitle}>Problems</Text>
                            </View>
                            <View style={styles.errorDetails}>
                                {order.errorCode.map((item, index) => (
                                    <Text key={index} style={styles.errorText}>
                                        • {item?.description}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}


                    {order.EstimatedBill && (
                        <View style={styles.detailSection}>
                            <View style={styles.detailHeader}>
                                {/* <IndianRupee size={16} color="#4B5563" /> */}
                                <Icon name='currency-rupee' size={16} color="#4B5563" />
                                <Text style={styles.detailTitle}>Bill Details</Text>
                            </View>
                            <View style={styles.billDetails}>
                                {order.EstimatedBill.Items.map((item, index) => (
                                    <View key={index} style={styles.billItem}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                        <Text style={styles.itemPrice}>₹{item.price}</Text>
                                    </View>
                                ))}
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalText}>Total Amount</Text>
                                    <Text style={styles.totalAmount}>
                                        ₹{order.EstimatedBill.EstimatedTotalPrice}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                    {order?.userId?.isAMCUser ? (
                         <View style={[styles.detailSection, { padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 }]}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
                                You are a AMC User
                            </Text>
                        </View>
                    ) : (
                        <View style={[styles.detailSection, { padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 }]}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
                                Bill Status:
                                <Text style={{ color: order.EstimatedBill?.BillStatus === 'Accepted' ? '#4CAF50' : '#F44336' }}>
                                    {' '}{order.EstimatedBill?.BillStatus || 'Bill Not Generatted Yet'}
                                </Text>
                            </Text>
                        </View>

                    )}



                    {order.EstimatedBill?.BillStatus === 'Pending' && (
                        <View style={{ flexDirection: 'row', justifyContent: 'start', gap: 12 }}>
                            <View style={styles.detailSection}>
                                <TouchableOpacity onPress={() => handleAcceptBill(true, order?.EstimatedBill?._id)} style={{ padding: 8, backgroundColor: '#4CAF50', borderRadius: 4 }}>
                                    <Text style={{ fontSize: 11, color: '#fff' }}>Accept Bill</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.detailSection}>
                                <TouchableOpacity onPress={() => handleAcceptBill(false, order?.EstimatedBill?._id)} style={{ padding: 8, backgroundColor: '#F44336', borderRadius: 4 }}>
                                    <Text style={{ fontSize: 11, color: '#fff' }}>Reject Bill</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}





                    {order.hasOwnProperty('beforeWorkVideo') && (
                        <View style={styles.detailSection}>
                            <View style={styles.detailHeader}>

                                <Icon name='truck-fast' size={16} color="#4B5563" />
                                <Text style={styles.detailTitle}>Before Work Video</Text>
                            </View>
                            <View style={styles.billDetails}>
                                <TouchableOpacity onPress={() => Linking.openURL(order.beforeWorkVideo?.url)}>
                                    <Text>Click Here To Watch Video</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {order.hasOwnProperty('afterWorkVideo') && (
                        <View style={styles.detailSection}>
                            <View style={styles.detailHeader}>
                                <Icon name='tooltip-check' size={16} color="#4B5563" />

                                <Text style={styles.detailTitle}>Complete Work Video</Text>
                            </View>
                            <View style={styles.billDetails}>
                                <TouchableOpacity onPress={() => Linking.openURL(order.afterWorkVideo?.url)}>
                                    <Text>Click Here To Watch Video</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {/* {console.log("refreshControl();",order?.userId?.isAMCUser)} */}

                    {!order?.userId?.isAMCUser ? (
                        order && order.hasOwnProperty('afterWorkVideo') && order.PaymentStatus === 'pending' && (
                            <Button onPress={PayMoney}>Pay Now</Button>
                        )
                    ) : (
                        order && order.hasOwnProperty('afterWorkVideo') && order.PaymentStatus === 'pending' && (
                            <Button onPress={() => handleServiceDone(order?._id)}>Service Done</Button>
                        )
                    )}



                </View>
            )}
        </View>
    );
};

export default function OrderPage() {
    const route = useRoute();
    const { id } = route.params || {};
    const navigation = useNavigation()
    const [orderData, setOrderData] = useState({
        allOrder: [],
        activeOrder: [],
        completeOrder: [],
        canceledOrder: [],
    });
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    const fetchOrderData = async () => {
        try {
            const data = await getMyAllOrder({ userId: id });


            if (data === "No orders found") {
                setOrderData({
                    allOrder: [],
                    activeOrder: [],
                    completeOrder: [],
                    canceledOrder: [],
                });
                return;
            } else {
                setOrderData({
                    allOrder: data.allOrder || [],
                    activeOrder: data.activeOrder || [],
                    completeOrder: data.completeOrder || [],
                    canceledOrder: data.canceledOrder || [],
                });
            }


        } catch (error) {

            console.error('Error fetching order datas:', error);
        }
    };



    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchOrderData().finally(() => setRefreshing(false));
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchOrderData();
        }
    }, [id]);

    const tabs = [
        { id: 'all', label: 'All', icon: 'view-grid-plus-outline', data: orderData.allOrder },
        { id: 'active', label: 'Active', icon: 'progress-clock', data: orderData.activeOrder },
        { id: 'completed', label: 'Completed', icon: 'shield-check', data: orderData.completeOrder },
        { id: 'canceled', label: 'Canceled', icon: 'cancel', data: orderData.canceledOrder },
    ];

    if (!orderData && !orderData.activeOrder && orderData.activeOrder.length === 0 && orderData.allOrder.length === 0 && orderData.completeOrder.length === 0 && orderData.CanceledOrder.length === 0) {
        return (
            <Layout>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }

                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.emptyProvider}>
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No orders found.</Text>
                            <Text style={styles.emptyText}>Place your first order and enjoy amazing service.</Text>
                            <Text style={styles.emptyText}>from BLUEACE INDIA</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.placeOrderButton}
                            onPress={() => navigation?.navigate('Services')}
                        >
                            <Text style={styles.emptyTexts}>Click here to place your first order</Text>
                            <Text style={styles.placeOrderText}>Place Order</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Layout>
        );
    }


    return (
        <Layout isHeaderShown={false}>
            <View style={styles.container}>
                {/* Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabsContainer}
                >
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            style={[
                                styles.tab,
                                activeTab === tab.id && styles.activeTab
                            ]}
                            onPress={() => setActiveTab(tab.id)}
                        >
                            <Icon
                                name={tab.icon}
                                size={20}
                                color={activeTab === tab.id ? colors.primary : colors.disabled}
                            />
                            <Text style={[
                                styles.tabText,
                                activeTab === tab.id && styles.activeTabText
                            ]}>
                                {tab.label} ({tab.data.length})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Orders List */}
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    style={styles.ordersList}
                >
                    {tabs.find(tab => tab.id === activeTab).data.map((order, index) => (
                        <OrderCard key={order._id || index} refreshControl={onRefresh} order={order} />
                    ))}
                </ScrollView>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    tabsContainer: {
        maxHeight: 70,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    activeTab: {
        backgroundColor: '#EEF2FF',
    },
    tabText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    activeTabText: {
        color: colors.primary,
    },
    ordersList: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    date: {
        fontSize: 14,
        color: colors.disabled,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    serviceDetails: {
        marginBottom: 12,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        color: '#4B5563',
        marginLeft: 8,
    },
    paymentStatus: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    paymentText: {
        fontSize: 14,
        fontWeight: '500',
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    expandText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primary,
        marginRight: 4,
    },
    expandedContent: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    detailSection: {
        marginBottom: 16,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginLeft: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    errorDetails: {
        marginLeft: 24,
    },
    errorText: {
        fontSize: 16,
        color: '#7F1D1D',
        marginBottom: 4,
    },
    scheduleInfo: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
    },
    billDetails: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 8,
    },
    billItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemName: {
        flex: 2,
        fontSize: 14,
        color: '#4B5563',
    },
    itemQuantity: {
        flex: 1,
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    itemPrice: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
        textAlign: 'right',
        fontWeight: '500',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 8,
        marginTop: 8,
    },
    totalText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    emptyProvider: {

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    emptyContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    emptyTexts: {
        fontSize: 16,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 5,
    },
    emptyText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    placeOrderButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    placeOrderText: {
        fontSize: 14,
        color: '#ffffff',
        marginBottom: 4,
    },
    placeOrderButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});