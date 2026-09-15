const axios = require('axios');

// Start trading session
const startTrading = async (req, res) => {
    try {
        const {
            user_id,
            access_token,
            trade_mode = 'VIRTUAL',
            capital = 50000,
            USE_AI_VALIDATION = false,
            DEBUG_MODE = true
        } = req.body;

        // Validate required fields
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'user_id is required'
            });
        }

        // Log trading session start
        console.log(`[Trading] Starting trading session for user: ${user_id}`, {
            trade_mode,
            capital,
            USE_AI_VALIDATION,
            DEBUG_MODE,
            timestamp: new Date().toISOString()
        });

        // Here you would integrate with your actual trading engine
        // For now, we'll simulate a successful start
        const sessionId = `session_${user_id}_${Date.now()}`;

        // Store session data (in production, use database)
        if (!global.tradingSessions) {
            global.tradingSessions = {};
        }

        global.tradingSessions[sessionId] = {
            user_id,
            trade_mode,
            capital,
            USE_AI_VALIDATION,
            DEBUG_MODE,
            status: 'ACTIVE',
            startTime: new Date(),
            trades: [],
            pnl: 0
        };

        // // Success response
        // res.status(200).json({
        //     success: true,
        //     message: 'Trading session started successfully',
        //     sessionId,
        //     data: {
        //         user_id,
        //         trade_mode,
        //         capital,
        //         USE_AI_VALIDATION,
        //         DEBUG_MODE,
        //         status: 'ACTIVE',
        //         startTime: new Date().toISOString()
        //     }
        // });

    

        // In production, here you would:
        // 1. Call your trading engine API
        // 2. Initialize market data listeners
        // 3. Set up trade execution logic
        // 4. Initialize risk management
        // 5. Start monitoring P&L

    } catch (error) {
        console.error('[Trading] Error starting trading session:', error);
        res.status(500).json({
            success: false,
            message: 'Error starting trading session',
            error: error.message
        });
    }
};

// Stop trading session
const stopTrading = async (req, res) => {
    try {
        const {
            user_id,
            access_token
        } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'user_id is required'
            });
        }

        console.log(`[Trading] Stopping trading session for user: ${user_id}`, {
            timestamp: new Date().toISOString()
        });

        // Find and stop the active session
        if (!global.tradingSessions) {
            global.tradingSessions = {};
        }

        let stoppedSession = null;
        for (const [sessionId, session] of Object.entries(global.tradingSessions)) {
            if (session.user_id === user_id && session.status === 'ACTIVE') {
                session.status = 'STOPPED';
                session.endTime = new Date();
                stoppedSession = session;
                break;
            }
        }

        if (!stoppedSession) {
            return res.status(404).json({
                success: false,
                message: 'No active trading session found'
            });
        }

        // Success response
        res.status(200).json({
            success: true,
            message: 'Trading session stopped successfully',
            data: {
                user_id,
                status: 'STOPPED',
                endTime: new Date().toISOString(),
                totalTrades: stoppedSession.trades.length,
                totalPnL: stoppedSession.pnl
            }
        });

        // In production, here you would:
        // 1. Close all open positions
        // 2. Cancel pending orders
        // 3. Stop market data listeners
        // 4. Generate trading report
        // 5. Save session data to database

    } catch (error) {
        console.error('[Trading] Error stopping trading session:', error);
        res.status(500).json({
            success: false,
            message: 'Error stopping trading session',
            error: error.message
        });
    }
};

// Get trading session status
const getSessionStatus = async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'user_id is required'
            });
        }

        if (!global.tradingSessions) {
            global.tradingSessions = {};
        }

        // Find active session for user
        let activeSession = null;
        for (const [sessionId, session] of Object.entries(global.tradingSessions)) {
            if (session.user_id === user_id && session.status === 'ACTIVE') {
                activeSession = session;
                break;
            }
        }

        res.status(200).json({
            success: true,
            data: activeSession || {
                status: 'NO_ACTIVE_SESSION',
                user_id
            }
        });

    } catch (error) {
        console.error('[Trading] Error getting session status:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting session status',
            error: error.message
        });
    }
};

// Get trading dashboard page
const getTradingDashboard = (req, res) => {
    try {
        // Extract user data from query params (passed from callback)
        const { userId, userName, email, userType, exchanges, accessToken } = req.query;

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <script>
                    // Store user data in sessionStorage for the dashboard to use
                    const userSession = {
                        userId: '${userId || 'DEV0'}',
                        userName: '${userName || 'User'}',
                        email: '${email || ''}',
                        userType: '${userType || ''}',
                        exchanges: '${exchanges || ''}',
                        accessToken: '${accessToken || ''}'
                    };
                    sessionStorage.setItem('userSession', JSON.stringify(userSession));
                    
                    // Redirect to static dashboard
                    window.location.href = '/trading-dashboard.html?' + new URLSearchParams(userSession).toString();
                </script>
            </head>
            <body>
                <p>Redirecting to trading dashboard...</p>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('[Trading] Error loading dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading dashboard',
            error: error.message
        });
    }
};

module.exports = {
    startTrading,
    stopTrading,
    getSessionStatus,
    getTradingDashboard
};
