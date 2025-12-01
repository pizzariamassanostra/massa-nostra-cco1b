// ============================================
// LIB: MOMENT.JS
// ============================================
// Biblioteca de datas configurada para UTC
// ============================================

import * as mmt from 'moment-timezone';

const moment = mmt;
mmt.tz.setDefault('UTC');

export default moment;
