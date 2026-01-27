import React, { useState, useEffect } from 'react';
// ═══════════════════════════════════════════════════════════════
// 🔍 ENVIRONMENT VARIABLE CHECK
// ═══════════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════');
console.log('🔍 ENVIRONMENT VARIABLE CHECK');
console.log('═══════════════════════════════════════════');
console.log('📍 All React Env Vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
console.log('🔑 RAZORPAY_KEY_ID:', process.env.REACT_APP_RAZORPAY_KEY_ID);
console.log('✅ Is Defined?', process.env.REACT_APP_RAZORPAY_KEY_ID ? 'YES ✅' : 'NO ❌');
console.log('✅ Type:', typeof process.env.REACT_APP_RAZORPAY_KEY_ID);
console.log('✅ Length:', process.env.REACT_APP_RAZORPAY_KEY_ID?.length || 0);
console.log('✅ First 10 chars:', process.env.REACT_APP_RAZORPAY_KEY_ID?.substring(0, 10) || 'N/A');
console.log('✅ Starts with rzp_?', process.env.REACT_APP_RAZORPAY_KEY_ID?.startsWith('rzp_') ? 'YES ✅' : 'NO ❌');
console.log('═══════════════════════════════════════════\n');



// ⚠️⚠️⚠️ TEMPORARY HARDCODED KEY - REMOVE AFTER TESTING ⚠️⚠️⚠️
const TEMP_RAZORPAY_KEY = 'rzp_test_RszNE79p7k94zB'; // 👈 PUT YOUR KEY HERE
// ⚠️⚠️⚠️ TEMPORARY HARDCODED KEY - REMOVE AFTER TESTING ⚠️⚠️⚠️

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  console.log('🎯 Pricing Component Mounted');
  console.log('💳 Current Billing Cycle:', billingCycle);

  // Load Razorpay script
  useEffect(() => {
    console.log('📜 Loading Razorpay script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        console.log('🧹 Cleaning up Razorpay script');
        document.body.removeChild(script);
      }
    };
  }, []);

  const toggleBillingCycle = () => {
    const newCycle = billingCycle === 'monthly' ? 'yearly' : 'monthly';
    console.log('🔄 Toggling billing cycle:', billingCycle, '→', newCycle);
    setBillingCycle(newCycle);
  };

  const handlePayment = async (role) => {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║           🚀 PAYMENT INITIATION STARTED                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('👤 User Role:', role);
    console.log('📅 Billing Cycle:', billingCycle);
    
    // ⚠️ USING HARDCODED KEY FOR TESTING
    const razorpayKey = TEMP_RAZORPAY_KEY || process.env.REACT_APP_RAZORPAY_KEY_ID;
    
    console.log('\n🔑 Razorpay Key Verification:');
    console.log('   ├─ Using: HARDCODED KEY ⚠️');
    console.log('   ├─ Raw Value:', razorpayKey);
    console.log('   ├─ Type:', typeof razorpayKey);
    console.log('   ├─ Is Undefined?', razorpayKey === undefined ? '❌ YES' : '✅ NO');
    console.log('   ├─ Is Empty String?', razorpayKey === '' ? '❌ YES' : '✅ NO');
    console.log('   ├─ Length:', razorpayKey?.length || 0);
    console.log('   ├─ First 10 chars:', razorpayKey?.substring(0, 10) || 'N/A');
    console.log('   └─ Starts with rzp_?', razorpayKey?.startsWith('rzp_') ? '✅ YES' : '❌ NO');
    
    if (!razorpayKey || razorpayKey === 'rzp_test_YOUR_ACTUAL_KEY_HERE') {
      console.error('\n❌ CRITICAL ERROR: Razorpay Key ID is missing or not set!');
      console.error('💡 Solutions:');
      console.error('   1. Replace TEMP_RAZORPAY_KEY with your actual Razorpay key');
      console.error('   2. Get your key from: https://dashboard.razorpay.com/app/keys');
      alert('⚠️ Payment configuration error!\n\nPlease set your Razorpay Key ID in the code.\nLine: const TEMP_RAZORPAY_KEY = ...');
      setLoadingPlan(null);
      return;
    }
    
    setLoadingPlan(role);
    
    try {
      const plan = pricingData[role];
      console.log('\n📦 Selected Plan:', plan.title);
      console.log('💰 Plan Details:', {
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        description: plan.description
      });
      
      const amount = billingCycle === 'monthly' 
        ? parseInt(plan.monthlyPrice.replace('₹', '').replace(',', '')) 
        : parseInt(plan.yearlyPrice.replace('₹', '').replace(',', ''));
      
      console.log('💵 Amount (INR):', amount);
      console.log('💵 Amount (Paise):', amount * 100);

      console.log('\n📡 Creating order on backend...');
      console.log('🌐 API Endpoint: http://localhost:4000/api/payment/create-order');
      console.log('📤 Request Payload:', {
        amount: amount * 100,
        currency: 'INR',
        planName: plan.title,
        billingCycle: billingCycle,
        userRole: role
      });

      // ⭐ Create order on backend
      const orderResponse = await fetch('http://localhost:4000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100,
          currency: 'INR',
          planName: plan.title,
          billingCycle: billingCycle,
          userRole: role
        })
      });

      console.log('📥 Order Response Status:', orderResponse.status, orderResponse.statusText);

      if (!orderResponse.ok) {
        console.error('❌ Order creation failed - HTTP Status:', orderResponse.status);
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();
      console.log('✅ Order created successfully!');
      console.log('📋 Order Details:', order);

      // Check if order creation was successful
      if (!order.success) {
        console.error('❌ Order creation failed:', order.message);
        throw new Error(order.message || 'Order creation failed');
      }

      console.log('\n🎨 Preparing Razorpay options...');

      const options = {
        key: razorpayKey, // Using hardcoded key for testing
        amount: order.amount,
        currency: order.currency,
        name: 'Chakshi Legal Platform',
        description: `${plan.title} Plan - ${billingCycle}`,
        image: 'https://your-logo-url.com/logo.png',
        order_id: order.id,
        handler: async function (response) {
          console.log('\n╔═══════════════════════════════════════════════════════════╗');
          console.log('║           ✅ PAYMENT SUCCESSFUL                          ║');
          console.log('╚═══════════════════════════════════════════════════════════╝');
          console.log('🎉 Payment Response:', response);
          console.log('📝 Order ID:', response.razorpay_order_id);
          console.log('💳 Payment ID:', response.razorpay_payment_id);
          console.log('🔐 Signature:', response.razorpay_signature);
          
          try {
            console.log('\n🔒 Verifying payment signature on backend...');
            console.log('🌐 API Endpoint: http://localhost:4000/api/payment/verify-payment');
            console.log('📤 Verification Payload:', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            const verifyResponse = await fetch('http://localhost:4000/api/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            console.log('📥 Verification Response Status:', verifyResponse.status);

            const verifyData = await verifyResponse.json();
            console.log('📋 Verification Data:', verifyData);

            if (verifyData.success) {
              console.log('✅ Payment verified successfully!');
              console.log('🎊 Subscription activated!');
              setPaymentStatus('success');
              
              // TODO: Update user subscription in your database
              console.log('⚠️ TODO: Update user subscription in database');
              // TODO: Redirect to dashboard or show success page
              console.log('⚠️ TODO: Redirect to dashboard');
              
            } else {
              console.error('❌ Payment verification failed on backend');
              console.error('📄 Error Details:', verifyData);
              setPaymentStatus('error');
            }
          } catch (error) {
            console.error('\n╔═══════════════════════════════════════════════════════════╗');
            console.error('║           ❌ PAYMENT VERIFICATION ERROR                  ║');
            console.error('╚═══════════════════════════════════════════════════════════╝');
            console.error('Error Name:', error.name);
            console.error('Error Message:', error.message);
            console.error('Error Stack:', error.stack);
            setPaymentStatus('error');
          }
          
          setLoadingPlan(null);
          console.log('⏱️ Hiding status notification in 5 seconds...');
          setTimeout(() => setPaymentStatus(null), 5000);
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999'
        },
        notes: {
          planName: plan.title,
          billingCycle: billingCycle,
          userRole: role
        },
        theme: {
          color: '#b69d74'
        },
        modal: {
          ondismiss: function () {
            console.log('\n⚠️ Payment modal dismissed by user');
            console.log('🚫 Payment cancelled');
            setLoadingPlan(null);
            setPaymentStatus('cancelled');
            setTimeout(() => setPaymentStatus(null), 3000);
          }
        }
      };

      console.log('📋 Razorpay Options Configured:', {
        key: options.key ? `✅ ${options.key.substring(0, 15)}...` : '❌ Missing',
        amount: options.amount,
        currency: options.currency,
        order_id: options.order_id,
        name: options.name
      });

      // Open Razorpay checkout
      console.log('🚀 Opening Razorpay checkout modal...');
      const rzp = new window.Razorpay(options);
      rzp.open();
      console.log('✅ Razorpay modal opened successfully');

      // Handle payment failure
      rzp.on('payment.failed', function (response) {
        console.error('\n╔═══════════════════════════════════════════════════════════╗');
        console.error('║           ❌ PAYMENT FAILED                              ║');
        console.error('╚═══════════════════════════════════════════════════════════╝');
        console.error('Error Code:', response.error.code);
        console.error('Error Description:', response.error.description);
        console.error('Error Source:', response.error.source);
        console.error('Error Step:', response.error.step);
        console.error('Error Reason:', response.error.reason);
        console.error('Full Error Object:', response.error);
        
        setPaymentStatus('error');
        setLoadingPlan(null);
        setTimeout(() => setPaymentStatus(null), 5000);
      });

    } catch (error) {
      console.error('\n╔═══════════════════════════════════════════════════════════╗');
      console.error('║           ❌ PAYMENT INITIATION FAILED                   ║');
      console.error('╚═══════════════════════════════════════════════════════════╝');
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      
      setPaymentStatus('error');
      setLoadingPlan(null);
      setTimeout(() => setPaymentStatus(null), 5000);
    }
    
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
  };

  const pricingData = {
    student: {
      title: "Student",
      monthlyPrice: "₹99",
      yearlyPrice: "₹999",
      description: "Perfect for law students",
      features: [
        "Case Law Access",
        "Study Materials",
        "Notes Organization",
        "Basic Support",
        "Mobile App Access",
        "Legal Dictionary"
      ],
      popular: false,
      backgroundImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    advocate: {
      title: "Advocate",
      monthlyPrice: "₹499",
      yearlyPrice: "₹4,999",
      description: "For practicing advocates",
      features: [
        "Case Management",
        "Document Storage",
        "Client Portal",
        "Priority Support",
        "Case Tracking",
        "Legal Research Tools"
      ],
      popular: true,
      backgroundImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    clerk: {
      title: "Clerk",
      monthlyPrice: "₹299",
      yearlyPrice: "₹2,999",
      description: "For court clerks",
      features: [
        "Case Tracking",
        "Document Management",
        "Court Calendar",
        "Email Support",
        "SMS Notifications",
        "Basic Reporting"
      ],
      popular: false,
      backgroundImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  };

  console.log('📊 Available Plans:', Object.keys(pricingData));

  return (
    <section
      className="min-h-screen py-12"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(245, 245, 239, 0.85)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Select the perfect plan tailored for your legal journey
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 bg-white rounded-full py-2 px-4 shadow-sm inline-flex">
            <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={toggleBillingCycle}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-[#b69d74]' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                billingCycle === 'yearly' ? 'transform translate-x-7' : 'transform translate-x-1'
              } shadow-md`}></div>
            </button>
            <span className={`text-lg font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly <span className="text-sm text-green-600 ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(pricingData).map(([role, plan]) => (
            <div 
              key={role}
              className={`relative bg-white rounded-2xl shadow-xl border-2 ${
                plan.popular ? 'border-[#b69d74] transform scale-105' : 'border-gray-200'
              } transition-all duration-300 hover:shadow-2xl`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#b69d74] text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              {/* Card Header with Background */}
              <div 
                className="h-40 bg-cover bg-center rounded-t-2xl relative"
                style={{ backgroundImage: `url(${plan.backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-t-2xl"></div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-white text-opacity-90 text-center">
                    {plan.description}
                  </p>
                </div>
              </div>
              
              {/* Pricing */}
              <div className="p-6 border-b border-gray-200">
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                  {billingCycle === 'yearly' && (
                    <p className="text-green-600 text-sm font-medium mt-1">
                      Equivalent to {plan.monthlyPrice}/month
                    </p>
                  )}
                </div>
              </div>
              
              {/* Features */}
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#b69d74] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <button 
                  onClick={() => {
                    console.log('🖱️ Button clicked for role:', role);
                    handlePayment(role);
                  }}
                  disabled={loadingPlan === role}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-[#b69d74] hover:bg-[#a58c66] text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingPlan === role ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Get Started as ${plan.title}`
                  )}
                </button>
                
                <p className="text-center text-gray-500 text-sm mt-3">
                  7-day free trial • No credit card required
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Status Notification */}
        {paymentStatus && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
            paymentStatus ? 'translate-x-0' : 'translate-x-full'
          } ${
            paymentStatus === 'success' ? 'bg-green-500 text-white' : 
            paymentStatus === 'error' ? 'bg-red-500 text-white' : 
            'bg-yellow-500 text-white'
          }`}>
            <div className="flex items-center gap-3">
              {paymentStatus === 'success' && (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {paymentStatus === 'error' && (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
              {paymentStatus === 'cancelled' && (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span>
                {paymentStatus === 'success' && 'Payment Successful!'}
                {paymentStatus === 'error' && 'Payment Failed. Please try again.'}
                {paymentStatus === 'cancelled' && 'Payment Cancelled'}
              </span>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need help choosing the right plan?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you select the perfect plan for your needs.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  console.log('📞 Contact Sales button clicked');
                  window.dispatchEvent(new CustomEvent('open-register-modal'));
                }}
                className="bg-[#b69d74] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a58c66] transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
