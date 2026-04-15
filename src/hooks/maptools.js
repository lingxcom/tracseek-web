function outOfChina(lng, lat) {
            return (lng < 72.004 || lng > 137.8347) || (lat < 0.8293 || lat > 55.8271);
        }

        // 转换所需的常量
        const PI = 3.14159265358979324;
        const a = 6378245.0;
        const ee = 0.00669342162296594323;

        // 纬度转换
        function transformLat(x, y) {
            let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
            return ret;
        }

        // 经度转换
        function transformLng(x, y) {
            let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
            return ret;
        }

        // WGS - 84 转 GCJ - 02
export   function wgs84ToGcj02(lng, lat) {
            if (outOfChina(lng, lat)) {
                return [lng, lat];
            }
            let dLat = transformLat(lng - 105.0, lat - 35.0);
            let dLng = transformLng(lng - 105.0, lat - 35.0);
            let radLat = lat / 180.0 * PI;
            let magic = Math.sin(radLat);
            magic = 1 - ee * magic * magic;
            let sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
            dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
            let mgLat = lat + dLat;
            let mgLng = lng + dLng;
            return [mgLng, mgLat];
        }
export function gcj02ToWgs84(lng, lat) {
        if (outOfChina(lng, lat)) {
            return [lng, lat]
        }
        else {
            let dlat = transformLat(lng - 105.0, lat - 35.0);
            let dlng = transformLng(lng - 105.0, lat - 35.0);
            let radlat = lat / 180.0 * PI;
            let magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            let sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
           let mglat = lat + dlat;
           let mglng = lng + dlng;
            return [lng * 2 - mglng, lat * 2 - mglat]
        }
    }


		function gcj02ToBd09(lng, lat) {
		    const x_pi = 3.14159265358979324 * 3000.0 / 180.0;
		    const x = lng;
		    const y = lat;
		    const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
		    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
		    const bd_lng = z * Math.cos(theta) + 0.0065;
		    const bd_lat = z * Math.sin(theta) + 0.006;
		    return [bd_lng, bd_lat];
		}
		
		// WGS - 84 转 BD - 09
export function wgs84ToBd09(lng, lat) {
		    const [gcj02Lng, gcj02Lat] = wgs84ToGcj02(lng, lat);
		    return gcj02ToBd09(gcj02Lng, gcj02Lat);
		}