package handlers

import (
	"fmt"
	"strconv"
	"strings"

	"server/models"
)

func expandRange(from, to string) []string {
	var result []string

	prefixLen := 0
	for i := len(from) - 1; i >= 0; i-- {
		if from[i] < '0' || from[i] > '9' {
			prefixLen = i + 1
			break
		}
	}
	prefix := from[:prefixLen]
	fromNum, err1 := strconv.Atoi(from[prefixLen:])
	toNum, err2 := strconv.Atoi(to[prefixLen:])
	if err1 != nil || err2 != nil {
		return []string{from, to}
	}
	width := len(from[prefixLen:])
	for n := fromNum; n <= toNum; n++ {
		result = append(result, fmt.Sprintf("%s%0*d", prefix, width, n))
	}
	return result
}

// buildSeatingData13June2026FN returns seating records for
// Exam Date: 13-06-2026, Session: FN (09:00 AM to 12:00 PM)
// Course Code: 22HS006
func buildSeatingData13June2026FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 301 - M.B.A. - 24MB201
		{HallNo: "AE 301", CourseCode: "24MB201", RegisterNos: []string{
			"7376257MB101", "7376257MB102", "7376257MB104",
		}},

		// S.No 2 - AE 301 - B.E. ME - 22HS006
		{HallNo: "AE 301", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251ME143", "7376251ME152")
		}()},

		// S.No 3 - AE 301 - B.E. MZ - 22HS006
		{HallNo: "AE 301", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251MZ151", "7376251MZ162")
		}()},

		// S.No 4 - AE 302 - B.E. CS - 22HS006
		{HallNo: "AE 302", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS235", "7376251CS249")
		}()},

		// S.No 5 - AE 302 - B.Tech. IT - 22HS006
		{HallNo: "AE 302", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT213", "7376252IT222")
		}()},

		// S.No 6 - EW 101 - B.E. CS - 22HS006
		{HallNo: "EW 101", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS250", "7376251CS264")
		}()},

		// S.No 7 - EW 101 - B.Tech. IT - 22HS006
		{HallNo: "EW 101", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT223", "7376252IT232")
		}()},

		// S.No 8 - EW 102 - B.E. CS - 22HS006
		{HallNo: "EW 102", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS265", "7376251CS279")
		}()},

		// S.No 9 - EW 102 - B.Tech. IT - 22HS006
		{HallNo: "EW 102", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT233", "7376252IT242")
		}()},

		// S.No 10 - EW 103 - B.E. CS - 22HS006
		{HallNo: "EW 103", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS295", "7376251CS309")
		}()},

		// S.No 11 - EW 103 - B.Tech. IT - 22HS006
		{HallNo: "EW 103", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT253", "7376252IT262")
		}()},

		// S.No 12 - EW 104 - B.E. CS - 22HS006
		{HallNo: "EW 104", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS355", "7376251CS369")
		}()},

		// S.No 13 - EW 104 - B.Tech. IT - 22HS006
		{HallNo: "EW 104", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT293", "7376252IT302")
		}()},

		// S.No 14 - EW 105 - B.E. CS - 22HS006
		{HallNo: "EW 105", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS370", "7376251CS384")
		}()},

		// S.No 15 - EW 105 - B.Tech. IT - 22HS006
		{HallNo: "EW 105", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT303", "7376252IT312")
		}()},

		// S.No 16 - EW 106 - B.E. CS - 22HS006
		{HallNo: "EW 106", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS415", "7376251CS429")
		}()},

		// S.No 17 - EW 106 - B.Tech. IT - 22HS006
		{HallNo: "EW 106", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT333", "7376252IT342")
		}()},

		// S.No 18 - EW 107 - B.E. CS - 22HS006
		{HallNo: "EW 107", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS280", "7376251CS294")
		}()},

		// S.No 19 - EW 107 - B.Tech. IT - 22HS006
		{HallNo: "EW 107", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT243", "7376252IT252")
		}()},

		// S.No 20 - EW 108 - B.E. CS - 22HS006
		{HallNo: "EW 108", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS310", "7376251CS324")
		}()},

		// S.No 21 - EW 108 - B.Tech. IT - 22HS006
		{HallNo: "EW 108", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT263", "7376252IT272")
		}()},

		// S.No 22 - EW 109 - B.E. CS - 22HS006
		{HallNo: "EW 109", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS325", "7376251CS339")
		}()},

		// S.No 23 - EW 109 - B.Tech. IT - 22HS006
		{HallNo: "EW 109", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT273", "7376252IT282")
		}()},

		// S.No 24 - EW 111 - B.E. CS - 22HS006
		{HallNo: "EW 111", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS340", "7376251CS354")
		}()},

		// S.No 25 - EW 111 - B.Tech. IT - 22HS006
		{HallNo: "EW 111", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT283", "7376252IT292")
		}()},

		// S.No 26 - EW 112 - B.E. CS - 22HS006
		{HallNo: "EW 112", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS385", "7376251CS399")
		}()},

		// S.No 27 - EW 112 - B.Tech. IT - 22HS006
		{HallNo: "EW 112", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT313", "7376252IT322")
		}()},

		// S.No 28 - EW 113 - B.E. EC - 22HS006
		{HallNo: "EW 113", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC158", "7376251EC167")
		}()},

		// S.No 29 - EW 113 - B.Tech. AD - 22HS006
		{HallNo: "EW 113", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD179", "7376252AD193")
		}()},

		// S.No 30 - EW 114 - B.E. EC - 22HS006
		{HallNo: "EW 114", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC208", "7376251EC217")
		}()},

		// S.No 31 - EW 114 - B.Tech. AD - 22HS006
		{HallNo: "EW 114", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD254", "7376252AD268")
		}()},

		// S.No 32 - EW 115 - B.E. EC - 22HS006
		{HallNo: "EW 115", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC243", "7376251EC252")
		}()},

		// S.No 33 - EW 115 - B.Tech. AD - 22HS006
		{HallNo: "EW 115", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD294", "7376252AD308")
		}()},

		// S.No 34 - EW 116 - B.E. EC - 22HS006
		{HallNo: "EW 116", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC253", "7376251EC262")
		}()},

		// S.No 35 - EW 116 - B.Tech. AD - 22HS006
		{HallNo: "EW 116", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD309", "7376252AD323")
		}()},

		// S.No 36 - EW 117 - B.E. EC - 22HS006
		{HallNo: "EW 117", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC273", "7376251EC282")
		}()},

		// S.No 37 - EW 117 - B.Tech. AD - 22HS006
		{HallNo: "EW 117", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD339", "7376252AD353")
		}()},

		// S.No 38 - EW 118 - B.Tech. AL - 22HS006 (arrear)
		{HallNo: "EW 118", CourseCode: "22HS006", RegisterNos: []string{
			"7376242AL207",
		}},

		// S.No 39 - EW 118 - B.E. EC - 22HS006
		{HallNo: "EW 118", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC293", "7376251EC302")
		}()},

		// S.No 40 - EW 118 - B.Tech. AD - 22HS006
		{HallNo: "EW 118", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD369", "7376252AD381")
		}()},

		// S.No 41 - EW 118 - B.Tech. AL - 22HS006
		{HallNo: "EW 118", CourseCode: "22HS006", RegisterNos: []string{
			"7376252AL101",
		}},

		// S.No 42 - EW 201 - B.E. CS - 22HS006
		{HallNo: "EW 201", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS445", "7376251CS459")
		}()},

		// S.No 43 - EW 201 - B.Tech. IT - 22HS006
		{HallNo: "EW 201", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT353", "7376252IT362")
		}()},

		// S.No 44 - EW 202 - B.Tech. AD - 22HS006 (arrear)
		{HallNo: "EW 202", CourseCode: "22HS006", RegisterNos: []string{
			"7376242AD189", "7376242AD218",
		}},

		// S.No 45 - EW 202 - B.E. CS - 22HS006
		{HallNo: "EW 202", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS475", "7376251CS479")
		}()},

		// S.No 46 - EW 202 - B.Tech. IT - 22HS006
		{HallNo: "EW 202", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT373", "7376252IT382")
		}()},

		// S.No 47 - EW 202 - B.Tech. AD - 22HS006
		{HallNo: "EW 202", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD101", "7376252AD108")
		}()},

		// S.No 48 - EW 203 - B.E. EC - 22HS006
		{HallNo: "EW 203", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC168", "7376251EC177")
		}()},

		// S.No 49 - EW 203 - B.Tech. AD - 22HS006
		{HallNo: "EW 203", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD194", "7376252AD208")
		}()},

		// S.No 50 - EW 206 - B.E. EC - 22HS006
		{HallNo: "EW 206", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC218", "7376251EC242")
		}()},

		// S.No 51 - EW 206 - B.Tech. AD - 22HS006
		{HallNo: "EW 206", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD269", "7376252AD293")
		}()},

		// S.No 52 - EW 207 - B.E. CS - 22HS006
		{HallNo: "EW 207", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS400", "7376251CS414")
		}()},

		// S.No 53 - EW 207 - B.Tech. IT - 22HS006
		{HallNo: "EW 207", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT323", "7376252IT332")
		}()},

		// S.No 54 - EW 208 - B.E. CS - 22HS006
		{HallNo: "EW 208", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS430", "7376251CS444")
		}()},

		// S.No 55 - EW 208 - B.Tech. IT - 22HS006
		{HallNo: "EW 208", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT343", "7376252IT352")
		}()},

		// S.No 56 - EW 209 - B.E. CS - 22HS006
		{HallNo: "EW 209", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS460", "7376251CS474")
		}()},

		// S.No 57 - EW 209 - B.Tech. IT - 22HS006
		{HallNo: "EW 209", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT363", "7376252IT372")
		}()},

		// S.No 58 - EW 212 - B.E. EC - 22HS006
		{HallNo: "EW 212", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC113", "7376251EC137")
		}()},

		// S.No 59 - EW 212 - B.Tech. AD - 22HS006
		{HallNo: "EW 212", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD129", "7376252AD153")
		}()},

		// S.No 60 - EW 213 - B.E. EC - 22HS006
		{HallNo: "EW 213", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC303", "7376251EC312")
		}()},

		// S.No 61 - EW 213 - B.Tech. AL - 22HS006
		{HallNo: "EW 213", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AL102", "7376252AL116")
		}()},

		// S.No 62 - EW 214 - B.E. EC - 22HS006
		{HallNo: "EW 214", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC313", "7376251EC322")
		}()},

		// S.No 63 - EW 214 - B.Tech. AL - 22HS006
		{HallNo: "EW 214", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AL117", "7376252AL131")
		}()},

		// S.No 64 - EW 215 - B.E. EC - 22HS006
		{HallNo: "EW 215", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC333", "7376251EC342")
		}()},

		// S.No 65 - EW 215 - B.Tech. AL - 22HS006
		{HallNo: "EW 215", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AL142", "7376252AL156")
		}()},

		// S.No 66 - EW 217 - B.Tech. BT - 22HS006
		{HallNo: "EW 217", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252BT102", "7376252BT111")
		}()},

		// S.No 67 - EW 217 - B.Tech. AL - 22HS006
		{HallNo: "EW 217", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AL167", "7376252AL176")
		}()},

		// S.No 68 - EW 218 - B.Tech. BT - 22HS006
		{HallNo: "EW 218", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252BT112", "7376252BT136")
		}()},

		// S.No 69 - EW 218 - B.Tech. AL - 22HS006
		{HallNo: "EW 218", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AL177", "7376252AL201")
		}()},

		// S.No 70 - MECH DH - B.E. CS - 22HS006
		{HallNo: "MECH DH", CourseCode: "22HS006", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS115", "7376251CS128")...)
			r = append(r, expandRange("7376251CS130", "7376251CS168")...)
			r = append(r, expandRange("7376251CS170", "7376251CS188")...)
			return r
		}()},

		// S.No 71 - MECH DH - B.Tech. IT - 22HS006
		{HallNo: "MECH DH", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT111", "7376252IT182")
		}()},

		// S.No 72 - MH 302 - B.E. CS - 22HS006
		{HallNo: "MH 302", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS189", "7376251CS203")
		}()},

		// S.No 73 - MH 302 - B.Tech. IT - 22HS006
		{HallNo: "MH 302", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT183", "7376252IT192")
		}()},

		// S.No 74 - MH 303 - B.E. CS - 22HS006
		{HallNo: "MH 303", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS204", "7376251CS218")
		}()},

		// S.No 75 - MH 303 - B.Tech. IT - 22HS006
		{HallNo: "MH 303", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT193", "7376252IT202")
		}()},

		// S.No 76 - MH 305 - B.E. CS - 22HS006
		{HallNo: "MH 305", CourseCode: "22HS006", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS219", "7376251CS228")...)
			r = append(r, expandRange("7376251CS230", "7376251CS234")...)
			return r
		}()},

		// S.No 77 - MH 305 - B.Tech. IT - 22HS006
		{HallNo: "MH 305", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT203", "7376252IT212")
		}()},

		// S.No 78 - MH 306 - B.E. CS - 22HS006 (arrear)
		{HallNo: "MH 306", CourseCode: "22HS006", RegisterNos: []string{
			"7376241CS474",
		}},

		// S.No 79 - MH 306 - B.Tech. IT - 22HS006 (arrear)
		{HallNo: "MH 306", CourseCode: "22HS006", RegisterNos: []string{
			"7376242IT184",
		}},

		// S.No 80 - MH 306 - B.E. CS - 22HS006
		{HallNo: "MH 306", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251CS101", "7376251CS114")
		}()},

		// S.No 81 - MH 306 - B.Tech. IT - 22HS006
		{HallNo: "MH 306", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT102", "7376252IT110")
		}()},

		// S.No 82 - SF B01 - M.B.A. - 24MB201
		{HallNo: "SF B01", CourseCode: "24MB201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376257MB105", "7376257MB123")...)
			r = append(r, "7376257MB125")
			return r
		}()},

		// S.No 83 - SF B01 - B.E. ME - 22HS006
		{HallNo: "SF B01", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251ME153", "7376251ME160")
		}()},

		// S.No 84 - SF B01 - B.Tech. AG - 22HS006
		{HallNo: "SF B01", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AG101", "7376252AG112")
		}()},

		// S.No 85 - SF B02 - M.E. IS - 24IS21
		{HallNo: "SF B02", CourseCode: "24IS21", RegisterNos: func() []string {
			return expandRange("7376254IS101", "7376254IS106")
		}()},

		// S.No 86 - SF B02 - M.B.A. - 24MB201
		{HallNo: "SF B02", CourseCode: "24MB201", RegisterNos: func() []string {
			return expandRange("7376257MB126", "7376257MB145")
		}()},

		// S.No 87 - SF B02 - B.Tech. AG - 22HS006
		{HallNo: "SF B02", CourseCode: "22HS006", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376252AG113")
			r = append(r, expandRange("7376252AG115", "7376252AG127")...)
			return r
		}()},

		// S.No 88 - SF B03 - B.E. BM - 22HS006
		{HallNo: "SF B03", CourseCode: "22HS006", RegisterNos: []string{"7376241BM501"}},

		// S.No 89 - SF B03 - B.E. SE - 22HS006
		{HallNo: "SF B03", CourseCode: "22HS006", RegisterNos: []string{"7376231SE144"}},

		// S.No 90 - SF B03 - B.E. CD - 22HS006
		{HallNo: "SF B03", CourseCode: "22HS006", RegisterNos: []string{"7376241CD501"}},

		// S.No 91 - SF B03 - Ph.D. IC - 24CS21
		{HallNo: "SF B03", CourseCode: "24CS21", RegisterNos: []string{
			"25244691339", "26144691211", "26244691201", "26244691520",
		}},

		// S.No 92 - SF B03 - Ph.D. EC - 24CS21
		{HallNo: "SF B03", CourseCode: "24CS21", RegisterNos: []string{
			"25149697236", "25249697284", "26249691124",
		}},

		// S.No 93 - SF B03 - M.E. CS - 24CS21
		{HallNo: "SF B03", CourseCode: "24CS21", RegisterNos: func() []string {
			return expandRange("7376254CS101", "7376254CS111")
		}()},

		// S.No 94 - SF B03 - M.E. IS - 24IS21
		{HallNo: "SF B03", CourseCode: "24IS21", RegisterNos: []string{
			"7376254IS107", "7376254IS108",
		}},

		// S.No 95 - SF B03 - M.B.A. - 24MB201
		{HallNo: "SF B03", CourseCode: "24MB201", RegisterNos: []string{
			"7376257MB146", "7376257MB147",
		}},

		// S.No 96 - WW 002 - B.E. EC - 22HS006 (arrear)
		{HallNo: "WW 002", CourseCode: "22HS006", RegisterNos: []string{"7376231EC283"}},

		// S.No 97 - WW 002 - 22HS006 (arrear)
		{HallNo: "WW 002", CourseCode: "22HS006", RegisterNos: []string{"7376241EC111"}},

		// S.No 98 - WW 002 - 22HS006
		{HallNo: "WW 002", CourseCode: "22HS006", RegisterNos: []string{
			"7376251EC101", "7376251EC102",
		}},

		// S.No 99 - WW 002 - B.Tech. IT - 22HS006
		{HallNo: "WW 002", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252IT383", "7376252IT388")
		}()},

		// S.No 100 - WW 002 - B.Tech. AD - 22HS006
		{HallNo: "WW 002", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD109", "7376252AD118")
		}()},

		// S.No 101 - WW 003 - B.E. EC - 22HS006
		{HallNo: "WW 003", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC103", "7376251EC112")
		}()},

		// S.No 102 - WW 003 - B.Tech. AD - 22HS006
		{HallNo: "WW 003", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD119", "7376252AD128")
		}()},

		// S.No 103 - WW 004 - B.E. EC - 22HS006
		{HallNo: "WW 004", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC138", "7376251EC147")
		}()},

		// S.No 104 - WW 004 - B.Tech. AD - 22HS006
		{HallNo: "WW 004", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD154", "7376252AD163")
		}()},

		// S.No 105 - WW 005 - B.E. EC - 22HS006
		{HallNo: "WW 005", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC148", "7376251EC157")
		}()},

		// S.No 106 - WW 005 - B.Tech. AD - 22HS006
		{HallNo: "WW 005", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD164", "7376252AD178")
		}()},

		// S.No 107 - WW 006 - B.E. EC - 22HS006
		{HallNo: "WW 006", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC178", "7376251EC187")
		}()},

		// S.No 108 - WW 006 - B.Tech. AD - 22HS006
		{HallNo: "WW 006", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD209", "7376252AD223")
		}()},

		// S.No 109 - WW 007 - B.E. EC - 22HS006
		{HallNo: "WW 007", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC188", "7376251EC197")
		}()},

		// S.No 110 - WW 007 - B.Tech. AD - 22HS006
		{HallNo: "WW 007", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD224", "7376252AD238")
		}()},

		// S.No 111 - WW 008 - B.E. EC - 22HS006
		{HallNo: "WW 008", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC198", "7376251EC207")
		}()},

		// S.No 112 - WW 008 - B.Tech. AD - 22HS006
		{HallNo: "WW 008", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD239", "7376252AD253")
		}()},

		// S.No 113 - WW 011 - B.E. EC - 22HS006
		{HallNo: "WW 011", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC263", "7376251EC272")
		}()},

		// S.No 114 - WW 011 - B.Tech. AD - 22HS006
		{HallNo: "WW 011", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD324", "7376252AD338")
		}()},

		// S.No 115 - WW 012 - B.E. EC - 22HS006
		{HallNo: "WW 012", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC283", "7376251EC292")
		}()},

		// S.No 116 - WW 012 - B.Tech. AD - 22HS006
		{HallNo: "WW 012", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AD354", "7376252AD368")
		}()},

		// S.No 117 - WW 216 - B.E. EC - 22HS006
		{HallNo: "WW 216", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC323", "7376251EC332")
		}()},

		// S.No 118 - WW 216 - B.Tech. AL - 22HS006
		{HallNo: "WW 216", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AL132", "7376252AL141")
		}()},

		// S.No 119 - WW 217 - B.E. EC - 22HS006
		{HallNo: "WW 217", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EC343", "7376251EC352")
		}()},

		// S.No 120 - WW 217 - B.Tech. AL - 22HS006
		{HallNo: "WW 217", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AL157", "7376252AL166")
		}()},

		// S.No 121 - WW 218 - B.Tech. BT - 22HS006
		{HallNo: "WW 218", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252BT137", "7376252BT146")
		}()},

		// S.No 122 - WW 218 - B.Tech. AL - 22HS006
		{HallNo: "WW 218", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AL202", "7376252AL216")
		}()},

		// S.No 123 - WW 219 - B.Tech. BT - 22HS006
		{HallNo: "WW 219", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252BT147", "7376252BT156")
		}()},

		// S.No 124 - WW 219 - B.Tech. AL - 22HS006
		{HallNo: "WW 219", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AL217", "7376252AL231")
		}()},

		// S.No 125 - WW 220 - B.Tech. BT - 22HS006
		{HallNo: "WW 220", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252BT157", "7376252BT166")
		}()},

		// S.No 126 - WW 220 - B.Tech. AL - 22HS006
		{HallNo: "WW 220", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AL232", "7376252AL241")
		}()},

		// S.No 127 - WW 221 - B.E. EE - 22HS006
		{HallNo: "WW 221", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EE102", "7376251EE106")
		}()},

		// S.No 128 - WW 221 - B.Tech. BT - 22HS006
		{HallNo: "WW 221", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252BT167", "7376252BT176")
		}()},

		// S.No 129 - WW 221 - B.Tech. AL - 22HS006
		{HallNo: "WW 221", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252AL242", "7376252AL246")
		}()},

		// S.No 130 - WW 222 - B.E. EE - 22HS006
		{HallNo: "WW 222", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EE107", "7376251EE131")
		}()},

		// S.No 131 - WW 222 - B.Tech. BT - 22HS006
		{HallNo: "WW 222", CourseCode: "22HS006", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252BT177", "7376252BT197")...)
			r = append(r, expandRange("7376252BT199", "7376252BT202")...)
			return r
		}()},

		// S.No 132 - WW 223 - B.E. EE - 22HS006
		{HallNo: "WW 223", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EE132", "7376251EE156")
		}()},

		// S.No 133 - WW 223 - B.E. EI - 22HS006
		{HallNo: "WW 223", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EI101", "7376251EI103")
		}()},

		// S.No 134 - WW 223 - B.Tech. BT - 22HS006
		{HallNo: "WW 223", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376252BT203", "7376252BT224")
		}()},

		// S.No 135 - WW 224 - B.E. EE - 22HS006
		{HallNo: "WW 224", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EE157", "7376251EE181")
		}()},

		// S.No 136 - WW 224 - B.E. EI - 22HS006
		{HallNo: "WW 224", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EI104", "7376251EI128")
		}()},

		// S.No 137 - WW 225 - B.E. EE - 22HS006
		{HallNo: "WW 225", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EE182", "7376251EE206")
		}()},

		// S.No 138 - WW 225 - B.E. EI - 22HS006
		{HallNo: "WW 225", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EI129", "7376251EI153")
		}()},

		// S.No 139 - WW 226 - B.E. EI - 22HS006
		{HallNo: "WW 226", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251EI154", "7376251EI162")
		}()},

		// S.No 140 - WW 226 - B.E. ME - 22HS006
		{HallNo: "WW 226", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251ME102", "7376251ME117")
		}()},

		// S.No 141 - WW 226 - B.E. MZ - 22HS006
		{HallNo: "WW 226", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251MZ101", "7376251MZ125")
		}()},

		// S.No 142 - WW 227 - B.E. ME - 22HS006
		{HallNo: "WW 227", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251ME118", "7376251ME142")
		}()},

		// S.No 143 - WW 227 - B.E. MZ - 22HS006
		{HallNo: "WW 227", CourseCode: "22HS006", RegisterNos: func() []string {
			return expandRange("7376251MZ126", "7376251MZ150")
		}()},
	}
}

// buildSeatingData13June2026AN returns seating records for
// Exam Date: 13-06-2026, Session: AN (01:30 PM to 04:30 PM)
// Course Code: 22MA101 (and 22CB101, 24MB101)
func buildSeatingData13June2026AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - WW 004 - B.E. CS - 22MA101 (arrear)
		{HallNo: "WW 004", CourseCode: "22MA101", RegisterNos: []string{
			"7376231CS207", "7376231CS235", "7376231CS259", "7376231CS288", "7376231CS292",
		}},

		// S.No 2 - WW 004 - B.Tech. IT - 22MA101 (arrear)
		{HallNo: "WW 004", CourseCode: "22MA101", RegisterNos: []string{"7376232IT282"}},

		// S.No 3 - WW 004 - B.E. CS - 22MA101 (arrear)
		{HallNo: "WW 004", CourseCode: "22MA101", RegisterNos: []string{
			"7376241CS141", "7376241CS143", "7376241CS144", "7376241CS150", "7376241CS151",
		}},

		// S.No 4 - WW 004 - B.Tech. IT - 22MA101 (arrear)
		{HallNo: "WW 004", CourseCode: "22MA101", RegisterNos: []string{
			"7376242IT108", "7376242IT110", "7376242IT113", "7376242IT129",
			"7376242IT141", "7376242IT146", "7376242IT155", "7376242IT161", "7376242IT164",
		}},

		// S.No 5 - WW 005 - B.E. CS - 22MA101 (arrear)
		{HallNo: "WW 005", CourseCode: "22MA101", RegisterNos: []string{
			"7376241CS185", "7376241CS230", "7376241CS248", "7376241CS257",
			"7376241CS272", "7376241CS288", "7376241CS297", "7376241CS307",
			"7376241CS318", "7376241CS323", "7376241CS332", "7376241CS395",
			"7376241CS409", "7376241CS438", "7376241CS455",
		}},

		// S.No 6 - WW 005 - B.Tech. IT - 22MA101 (arrear)
		{HallNo: "WW 005", CourseCode: "22MA101", RegisterNos: []string{
			"7376242IT168", "7376242IT184", "7376242IT188", "7376242IT214",
			"7376242IT217", "7376242IT226", "7376242IT227", "7376242IT250",
			"7376242IT257", "7376242IT287",
		}},

		// S.No 7 - WW 006 - B.E. CS - 22MA101 (arrear)
		{HallNo: "WW 006", CourseCode: "22MA101", RegisterNos: []string{
			"7376241CS467", "7376241CS473", "7376241CS474",
		}},

		// S.No 8 - WW 006 - B.Tech. IT - 22MA101 (arrear)
		{HallNo: "WW 006", CourseCode: "22MA101", RegisterNos: []string{
			"7376242IT297", "7376242IT298", "7376242IT300", "7376242IT304",
			"7376242IT319", "7376242IT337", "7376242IT341", "7376242IT345",
		}},

		// S.No 9 - WW 006 - B.E. CS - 22MA101
		{HallNo: "WW 006", CourseCode: "22MA101", RegisterNos: []string{
			"7376251CS129", "7376251CS163", "7376251CS166", "7376251CS193",
			"7376251CS200", "7376251CS220", "7376251CS229", "7376251CS260",
			"7376251CS261", "7376251CS275", "7376251CS294", "7376251CS302",
		}},

		// S.No 10 - WW 006 - B.Tech. IT - 22MA101
		{HallNo: "WW 006", CourseCode: "22MA101", RegisterNos: []string{
			"7376252IT115", "7376252IT122",
		}},

		// S.No 11 - WW 007 - B.E. EC - 22MA101 (arrear)
		{HallNo: "WW 007", CourseCode: "22MA101", RegisterNos: []string{
			"7376231EC101", "7376231EC283", "7376231EC305",
		}},

		// S.No 12 - WW 007 - B.E. CS - 22MA101
		{HallNo: "WW 007", CourseCode: "22MA101", RegisterNos: []string{
			"7376251CS314", "7376251CS322", "7376251CS336", "7376251CS350",
			"7376251CS352", "7376251CS385", "7376251CS387", "7376251CS429",
			"7376251CS433", "7376251CS446", "7376251CS467", "7376251CS479",
		}},

		// S.No 13 - WW 007 - B.Tech. IT - 22MA101
		{HallNo: "WW 007", CourseCode: "22MA101", RegisterNos: []string{
			"7376252IT166", "7376252IT202", "7376252IT250", "7376252IT253",
			"7376252IT264", "7376252IT269", "7376252IT291", "7376252IT297",
			"7376252IT326", "7376252IT331",
		}},

		// S.No 14 - WW 008 - B.E. EC - 22MA101 (arrear)
		{HallNo: "WW 008", CourseCode: "22MA101", RegisterNos: []string{
			"7376231EC318", "7376231EC334",
		}},

		// S.No 15 - WW 008 - B.Tech. AD - 22MA101 (arrear)
		{HallNo: "WW 008", CourseCode: "22MA101", RegisterNos: []string{"7376232AD258"}},

		// S.No 16 - WW 008 - B.E. EC - 22MA101 (arrear)
		{HallNo: "WW 008", CourseCode: "22MA101", RegisterNos: []string{
			"7376241EC133", "7376241EC137", "7376241EC138", "7376241EC139",
			"7376241EC147", "7376241EC241", "7376241EC246", "7376241EC256",
			"7376241EC273", "7376241EC312", "7376241EC321",
		}},

		// S.No 17 - WW 008 - B.Tech. AD - 22MA101 (arrear)
		{HallNo: "WW 008", CourseCode: "22MA101", RegisterNos: []string{
			"7376242AD107", "7376242AD137", "7376242AD183", "7376242AD189",
			"7376242AD190", "7376242AD202", "7376242AD218", "7376242AD242",
		}},

		// S.No 18 - WW 008 - B.E. EC - 22MA101
		{HallNo: "WW 008", CourseCode: "22MA101", RegisterNos: []string{
			"7376251EC112", "7376251EC141",
		}},

		// S.No 19 - WW 008 - B.Tech. IT - 22MA101
		{HallNo: "WW 008", CourseCode: "22MA101", RegisterNos: []string{"7376252IT376"}},

		// S.No 20 - WW 011 - B.Tech. AD - 22MA101 (arrear)
		{HallNo: "WW 011", CourseCode: "22MA101", RegisterNos: []string{
			"7376242AD262", "7376242AD265", "7376242AD301",
			"7376242AD311", "7376242AD320", "7376242AD326",
		}},

		// S.No 21 - WW 011 - B.Tech. AL - 22MA101 (arrear)
		{HallNo: "WW 011", CourseCode: "22MA101", RegisterNos: []string{
			"7376242AL104", "7376242AL109", "7376242AL144",
		}},

		// S.No 22 - WW 011 - B.E. EC - 22MA101
		{HallNo: "WW 011", CourseCode: "22MA101", RegisterNos: []string{
			"7376251EC156", "7376251EC183", "7376251EC185", "7376251EC186",
			"7376251EC200", "7376251EC204", "7376251EC205", "7376251EC215",
			"7376251EC243", "7376251EC267", "7376251EC270", "7376251EC335",
		}},

		// S.No 23 - WW 011 - B.Tech. AD - 22MA101
		{HallNo: "WW 011", CourseCode: "22MA101", RegisterNos: []string{
			"7376252AD104", "7376252AD129", "7376252AD137", "7376252AD141",
		}},

		// S.No 24 - WW 012 - B.E. EE - 22MA101 (arrear)
		{HallNo: "WW 012", CourseCode: "22MA101", RegisterNos: []string{"7376241EE132"}},

		// S.No 25 - WW 012 - B.Tech. AL - 22MA101 (arrear)
		{HallNo: "WW 012", CourseCode: "22MA101", RegisterNos: []string{
			"7376242AL156", "7376242AL157", "7376242AL169", "7376242AL176",
			"7376242AL190", "7376242AL193", "7376242AL197", "7376242AL207",
			"7376242AL208", "7376242AL220",
		}},

		// S.No 26 - WW 012 - B.Tech. AD - 22MA101
		{HallNo: "WW 012", CourseCode: "22MA101", RegisterNos: []string{
			"7376252AD147", "7376252AD192", "7376252AD201", "7376252AD204",
			"7376252AD214", "7376252AD218", "7376252AD257", "7376252AD316", "7376252AD331",
		}},

		// S.No 27 - WW 012 - B.Tech. AL - 22MA101
		{HallNo: "WW 012", CourseCode: "22MA101", RegisterNos: []string{
			"7376252AL103", "7376252AL122", "7376252AL133", "7376252AL162", "7376252AL188",
		}},

		// S.No 28 - WW 218 - B.E. EI - 22MA101 (arrear)
		{HallNo: "WW 218", CourseCode: "22MA101", RegisterNos: []string{
			"7376231EI128", "7376231EI143",
		}},

		// S.No 29 - WW 218 - B.E. EE - 22MA101 (arrear)
		{HallNo: "WW 218", CourseCode: "22MA101", RegisterNos: []string{
			"7376241EE145", "7376241EE147", "7376241EE157",
			"7376241EE160", "7376241EE188", "7376241EE193", "7376241EE198",
		}},

		// S.No 30 - WW 218 - B.E. EI - 22MA101 (arrear)
		{HallNo: "WW 218", CourseCode: "22MA101", RegisterNos: []string{
			"7376241EI111", "7376241EI119", "7376241EI123", "7376241EI142", "7376241EI146",
		}},

		// S.No 31 - WW 218 - B.E. EE - 22MA101
		{HallNo: "WW 218", CourseCode: "22MA101", RegisterNos: []string{
			"7376251EE112", "7376251EE114", "7376251EE138",
		}},

		// S.No 32 - WW 218 - B.E. EI - 22MA101
		{HallNo: "WW 218", CourseCode: "22MA101", RegisterNos: []string{
			"7376251EI102", "7376251EI103", "7376251EI108", "7376251EI126",
			"7376251EI134", "7376251EI142", "7376251EI145",
		}},

		// S.No 33 - WW 218 - B.Tech. AL - 22MA101
		{HallNo: "WW 218", CourseCode: "22MA101", RegisterNos: []string{"7376252AL231"}},

		// S.No 34 - WW 219 - B.E. ME - 22MA101 (arrear)
		{HallNo: "WW 219", CourseCode: "22MA101", RegisterNos: []string{
			"7376231ME124", "7376231ME136",
		}},

		// S.No 35 - WW 219 - B.Tech. CB - 22CB101 (arrear)
		{HallNo: "WW 219", CourseCode: "22CB101", RegisterNos: []string{"7376232CB111"}},

		// S.No 36 - WW 219 - B.E. ME - 22MA101 (arrear)
		{HallNo: "WW 219", CourseCode: "22MA101", RegisterNos: []string{
			"7376241ME104", "7376241ME154",
		}},

		// S.No 37 - WW 219 - B.Tech. BT - 22MA101 (arrear)
		{HallNo: "WW 219", CourseCode: "22MA101", RegisterNos: []string{
			"7376242BT123", "7376242BT138", "7376242BT145",
		}},

		// S.No 38 - WW 219 - B.Tech. CB - 22CB101 (arrear)
		{HallNo: "WW 219", CourseCode: "22CB101", RegisterNos: []string{"7376242CB116"}},

		// S.No 39 - WW 219 - B.E. EE - 22MA101
		{HallNo: "WW 219", CourseCode: "22MA101", RegisterNos: []string{
			"7376251EE143", "7376251EE144", "7376251EE152",
			"7376251EE154", "7376251EE164", "7376251EE170", "7376251EE206",
		}},

		// S.No 40 - WW 219 - B.E. EI - 22MA101
		{HallNo: "WW 219", CourseCode: "22MA101", RegisterNos: []string{
			"7376251EI153", "7376251EI161", "7376251EI162",
		}},

		// S.No 41 - WW 219 - B.E. ME - 22MA101
		{HallNo: "WW 219", CourseCode: "22MA101", RegisterNos: []string{
			"7376251ME107", "7376251ME119", "7376251ME121",
			"7376251ME133", "7376251ME140", "7376251ME154",
		}},

		// S.No 42 - WW 222 - B.E. CE - 22MA101 (arrear)
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{"7376231CE120"}},

		// S.No 43 - WW 222 - B.E. BM - 22MA101 (arrear)
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{"7376231BM148"}},

		// S.No 44 - WW 222 - B.E. SE - 22MA101 (arrear)
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{"7376231SE144"}},

		// S.No 45 - WW 222 - B.E. CD - 22MA101 (arrear)
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{"7376231CD143"}},

		// S.No 46 - WW 222 - B.E. MZ - 22MA101 (arrear)
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107", "7376231MZ113",
		}},

		// S.No 47 - WW 222 - B.Tech. CT - 22MA101 (arrear)
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{
			"7376232CT122", "7376232CT127",
		}},

		// S.No 48 - WW 222 - B.Tech. AG - 22MA101 (arrear)
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{
			"7376232AG129", "7376232AG151",
		}},

		// S.No 49 - WW 222 - B.E. MZ - 22MA101 (arrear)
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{
			"7376241MZ124", "7376241MZ143",
		}},

		// S.No 50 - WW 222 - B.Tech. BT - 22MA101 (arrear)
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{
			"7376242BT151", "7376242BT174", "7376242BT182", "7376242BT186", "7376242BT220",
		}},

		// S.No 51 - WW 222 - B.Tech. CB - 22CB101 (arrear)
		{HallNo: "WW 222", CourseCode: "22CB101", RegisterNos: []string{
			"7376242CB118", "7376242CB119", "7376242CB154",
		}},

		// S.No 52 - WW 222 - M.B.A. - 24MB101
		{HallNo: "WW 222", CourseCode: "24MB101", RegisterNos: []string{
			"7376257MB101", "7376257MB118", "7376257MB126",
		}},

		// S.No 53 - WW 222 - B.E. MZ - 22MA101
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{
			"7376251MZ104", "7376251MZ105",
		}},

		// S.No 54 - WW 222 - B.Tech. BT - 22MA101
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{
			"7376252BT120", "7376252BT143", "7376252BT187", "7376252BT198",
		}},

		// S.No 55 - WW 222 - B.Tech. AG - 22MA101
		{HallNo: "WW 222", CourseCode: "22MA101", RegisterNos: []string{
			"7376252AG114", "7376252AG119", "7376252AG127",
		}},
	}
}

// buildSeatingData15June2026FN returns seating records for
// Exam Date: 15-06-2026, Session: FN (09:00 AM to 12:00 PM)
// Course Code: 22GE004 (and 24MB202, 24CS22, 24IS22)
func buildSeatingData15June2026FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 107 - B.E. EC - 22GE004 (arrear)
		{HallNo: "EW 107", CourseCode: "22GE004", RegisterNos: []string{
			"7376231EC101", "7376231EC112", "7376231EC121", "7376231EC196",
			"7376231EC222", "7376231EC283", "7376231EC297", "7376231EC301",
			"7376231EC318", "7376231EC331", "7376231EC334",
		}},

		// S.No 2 - EW 107 - B.Tech. BT - 22GE004 (arrear)
		{HallNo: "EW 107", CourseCode: "22GE004", RegisterNos: []string{
			"7376232BT134", "7376232BT137", "7376232BT142", "7376232BT176", "7376232BT178",
		}},

		// S.No 3 - EW 107 - B.E. EC - 22GE004 (arrear)
		{HallNo: "EW 107", CourseCode: "22GE004", RegisterNos: []string{
			"7376241EC111", "7376241EC124", "7376241EC137", "7376241EC138",
		}},

		// S.No 4 - EW 107 - B.Tech. BT - 22GE004 (arrear)
		{HallNo: "EW 107", CourseCode: "22GE004", RegisterNos: []string{
			"7376242BT151", "7376242BT174", "7376242BT178",
		}},

		// S.No 5 - EW 107 - B.Tech. BT - 22GE004
		{HallNo: "EW 107", CourseCode: "22GE004", RegisterNos: []string{
			"7376252BT102", "7376252BT103",
		}},

		// S.No 6 - EW 108 - B.E. EC - 22GE004 (arrear)
		{HallNo: "EW 108", CourseCode: "22GE004", RegisterNos: []string{
			"7376241EC144", "7376241EC170", "7376241EC171", "7376241EC201",
			"7376241EC241", "7376241EC246", "7376241EC256", "7376241EC279",
			"7376241EC312", "7376241EC321", "7376241EC328",
		}},

		// S.No 7 - EW 108 - B.E. EC - 22GE004
		{HallNo: "EW 108", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC101", "7376251EC104")
		}()},

		// S.No 8 - EW 108 - B.Tech. BT - 22GE004
		{HallNo: "EW 108", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376252BT104", "7376252BT113")
		}()},

		// S.No 9 - EW 109 - B.E. EC - 22GE004
		{HallNo: "EW 109", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC105", "7376251EC119")
		}()},

		// S.No 10 - EW 109 - B.Tech. BT - 22GE004
		{HallNo: "EW 109", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376252BT114", "7376252BT123")
		}()},

		// S.No 11 - EW 111 - B.E. EC - 22GE004
		{HallNo: "EW 111", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC120", "7376251EC134")
		}()},

		// S.No 12 - EW 111 - B.Tech. BT - 22GE004
		{HallNo: "EW 111", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376252BT124", "7376252BT133")
		}()},

		// S.No 13 - EW 112 - B.E. EC - 22GE004
		{HallNo: "EW 112", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC135", "7376251EC149")
		}()},

		// S.No 14 - EW 112 - B.Tech. BT - 22GE004
		{HallNo: "EW 112", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376252BT134", "7376252BT143")
		}()},

		// S.No 15 - EW 113 - B.E. EI - 22GE004 (arrear)
		{HallNo: "EW 113", CourseCode: "22GE004", RegisterNos: []string{"7376231EI156"}},

		// S.No 16 - EW 113 - B.E. EI - 22GE004 (arrear)
		{HallNo: "EW 113", CourseCode: "22GE004", RegisterNos: []string{
			"7376241EI101", "7376241EI104", "7376241EI107", "7376241EI119",
			"7376241EI123", "7376241EI133", "7376241EI142", "7376241EI146", "7376241EI157",
		}},

		// S.No 17 - EW 113 - B.E. EC - 22GE004
		{HallNo: "EW 113", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC255", "7376251EC269")
		}()},

		// S.No 18 - EW 114 - B.E. EC - 22GE004
		{HallNo: "EW 114", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC315", "7376251EC329")
		}()},

		// S.No 19 - EW 114 - B.E. EI - 22GE004
		{HallNo: "EW 114", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EI130", "7376251EI139")
		}()},

		// S.No 20 - EW 115 - B.E. EC - 22GE004
		{HallNo: "EW 115", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC330", "7376251EC344")
		}()},

		// S.No 21 - EW 115 - B.E. EI - 22GE004
		{HallNo: "EW 115", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EI140", "7376251EI149")
		}()},

		// S.No 22 - EW 116 - B.E. EE - 22GE004 (arrear)
		{HallNo: "EW 116", CourseCode: "22GE004", RegisterNos: []string{
			"7376231EE104", "7376231EE111",
		}},

		// S.No 23 - EW 116 - B.E. EE - 22GE004 (arrear)
		{HallNo: "EW 116", CourseCode: "22GE004", RegisterNos: []string{
			"7376241EE115", "7376241EE132", "7376241EE145", "7376241EE147", "7376241EE157",
		}},

		// S.No 24 - EW 116 - B.E. EC - 22GE004
		{HallNo: "EW 116", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC345", "7376251EC352")
		}()},

		// S.No 25 - EW 116 - B.E. EI - 22GE004
		{HallNo: "EW 116", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EI150", "7376251EI159")
		}()},

		// S.No 26 - EW 117 - B.E. ME - 22GE004 (arrear)
		{HallNo: "EW 117", CourseCode: "22GE004", RegisterNos: []string{"7376241ME146"}},

		// S.No 27 - EW 117 - B.E. EE - 22GE004
		{HallNo: "EW 117", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EE113", "7376251EE127")
		}()},

		// S.No 28 - EW 117 - B.E. ME - 22GE004
		{HallNo: "EW 117", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251ME102", "7376251ME110")
		}()},

		// S.No 29 - EW 118 - B.E. EE - 22GE004
		{HallNo: "EW 118", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EE143", "7376251EE157")
		}()},

		// S.No 30 - EW 118 - B.E. ME - 22GE004
		{HallNo: "EW 118", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251ME121", "7376251ME130")
		}()},

		// S.No 31 - EW 207 - B.E. EC - 22GE004
		{HallNo: "EW 207", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC150", "7376251EC164")
		}()},

		// S.No 32 - EW 207 - B.Tech. BT - 22GE004
		{HallNo: "EW 207", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376252BT144", "7376252BT153")
		}()},

		// S.No 33 - EW 208 - B.E. EC - 22GE004
		{HallNo: "EW 208", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC165", "7376251EC179")
		}()},

		// S.No 34 - EW 208 - B.Tech. BT - 22GE004
		{HallNo: "EW 208", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376252BT154", "7376252BT163")
		}()},

		// S.No 35 - EW 209 - B.E. EC - 22GE004
		{HallNo: "EW 209", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC180", "7376251EC194")
		}()},

		// S.No 36 - EW 209 - B.Tech. BT - 22GE004
		{HallNo: "EW 209", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376252BT164", "7376252BT173")
		}()},

		// S.No 37 - EW 210 - B.E. EC - 22GE004
		{HallNo: "EW 210", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC195", "7376251EC204")
		}()},

		// S.No 38 - EW 210 - B.Tech. BT - 22GE004
		{HallNo: "EW 210", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376252BT174", "7376252BT183")
		}()},

		// S.No 39 - EW 211 - B.E. EC - 22GE004
		{HallNo: "EW 211", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC205", "7376251EC214")
		}()},

		// S.No 40 - EW 211 - B.Tech. BT - 22GE004
		{HallNo: "EW 211", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376252BT184", "7376252BT193")
		}()},

		// S.No 41 - EW 212 - B.E. EC - 22GE004
		{HallNo: "EW 212", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC215", "7376251EC239")
		}()},

		// S.No 42 - EW 212 - B.Tech. BT - 22GE004
		{HallNo: "EW 212", CourseCode: "22GE004", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252BT194", "7376252BT197")...)
			r = append(r, expandRange("7376252BT199", "7376252BT219")...)
			return r
		}()},

		// S.No 43 - EW 213 - B.E. EE - 22GE004
		{HallNo: "EW 213", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EE158", "7376251EE172")
		}()},

		// S.No 44 - EW 213 - B.E. ME - 22GE004
		{HallNo: "EW 213", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251ME131", "7376251ME140")
		}()},

		// S.No 45 - EW 214 - B.E. EE - 22GE004
		{HallNo: "EW 214", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EE173", "7376251EE187")
		}()},

		// S.No 46 - EW 214 - B.E. ME - 22GE004
		{HallNo: "EW 214", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251ME141", "7376251ME150")
		}()},

		// S.No 47 - EW 215 - B.E. EE - 22GE004
		{HallNo: "EW 215", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EE188", "7376251EE202")
		}()},

		// S.No 48 - EW 215 - B.E. ME - 22GE004
		{HallNo: "EW 215", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251ME151", "7376251ME160")
		}()},

		// S.No 49 - EW 218 - B.E. MZ - 22GE004 (arrear)
		{HallNo: "EW 218", CourseCode: "22GE004", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107", "7376231MZ111",
			"7376231MZ113", "7376231MZ119", "7376231MZ135", "7376231MZ148",
		}},

		// S.No 50 - EW 218 - B.E. MZ - 22GE004 (arrear)
		{HallNo: "EW 218", CourseCode: "22GE004", RegisterNos: []string{"7376241MZ124"}},

		// S.No 51 - EW 218 - M.B.A. - 24MB202
		{HallNo: "EW 218", CourseCode: "24MB202", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376257MB101", "7376257MB102")
			r = append(r, expandRange("7376257MB104", "7376257MB123")...)
			r = append(r, expandRange("7376257MB125", "7376257MB127")...)
			return r
		}()},

		// S.No 52 - EW 218 - B.E. EE - 22GE004
		{HallNo: "EW 218", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EE203", "7376251EE206")
		}()},

		// S.No 53 - EW 218 - B.E. MZ - 22GE004
		{HallNo: "EW 218", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251MZ101", "7376251MZ113")
		}()},

		// S.No 54 - WW 005 - B.E. EI - 22GE004 (arrear)
		{HallNo: "WW 005", CourseCode: "22GE004", RegisterNos: []string{
			"7376231EI117", "7376231EI128", "7376231EI143", "7376231EI144", "7376231EI151",
		}},

		// S.No 55 - WW 005 - B.E. EC - 22GE004
		{HallNo: "WW 005", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC240", "7376251EC254")
		}()},

		// S.No 56 - WW 005 - B.Tech. BT - 22GE004
		{HallNo: "WW 005", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376252BT220", "7376252BT224")
		}()},

		// S.No 57 - WW 006 - B.E. EI - 22GE004 (arrear)
		{HallNo: "WW 006", CourseCode: "22GE004", RegisterNos: []string{"7376241EI160"}},

		// S.No 58 - WW 006 - B.E. EC - 22GE004
		{HallNo: "WW 006", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC270", "7376251EC284")
		}()},

		// S.No 59 - WW 006 - B.E. EI - 22GE004
		{HallNo: "WW 006", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EI101", "7376251EI109")
		}()},

		// S.No 60 - WW 007 - B.E. EC - 22GE004
		{HallNo: "WW 007", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC285", "7376251EC299")
		}()},

		// S.No 61 - WW 007 - B.E. EI - 22GE004
		{HallNo: "WW 007", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EI110", "7376251EI119")
		}()},

		// S.No 62 - WW 008 - B.E. EC - 22GE004
		{HallNo: "WW 008", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EC300", "7376251EC314")
		}()},

		// S.No 63 - WW 008 - B.E. EI - 22GE004
		{HallNo: "WW 008", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EI120", "7376251EI129")
		}()},

		// S.No 64 - WW 011 - B.E. ME - 22GE004 (arrear)
		{HallNo: "WW 011", CourseCode: "22GE004", RegisterNos: []string{
			"7376231ME103", "7376231ME104", "7376231ME130", "7376231ME149",
		}},

		// S.No 65 - WW 011 - B.E. EE - 22GE004 (arrear)
		{HallNo: "WW 011", CourseCode: "22GE004", RegisterNos: []string{
			"7376241EE188", "7376241EE193", "7376241EE198", "7376241EE211",
		}},

		// S.No 66 - WW 011 - B.E. ME - 22GE004 (arrear)
		{HallNo: "WW 011", CourseCode: "22GE004", RegisterNos: []string{
			"7376241ME123", "7376241ME124", "7376241ME127",
		}},

		// S.No 67 - WW 011 - B.E. EE - 22GE004
		{HallNo: "WW 011", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EE102", "7376251EE112")
		}()},

		// S.No 68 - WW 011 - B.E. EI - 22GE004
		{HallNo: "WW 011", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EI160", "7376251EI162")
		}()},

		// S.No 69 - WW 012 - B.E. EE - 22GE004
		{HallNo: "WW 012", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251EE128", "7376251EE142")
		}()},

		// S.No 70 - WW 012 - B.E. ME - 22GE004
		{HallNo: "WW 012", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251ME111", "7376251ME120")
		}()},

		// S.No 71 - WW 218 - M.B.A. - 24MB202
		{HallNo: "WW 218", CourseCode: "24MB202", RegisterNos: func() []string {
			return expandRange("7376257MB128", "7376257MB137")
		}()},

		// S.No 72 - WW 218 - B.E. MZ - 22GE004
		{HallNo: "WW 218", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251MZ114", "7376251MZ128")
		}()},

		// S.No 73 - WW 219 - M.B.A. - 24MB202
		{HallNo: "WW 219", CourseCode: "24MB202", RegisterNos: func() []string {
			return expandRange("7376257MB138", "7376257MB147")
		}()},

		// S.No 74 - WW 219 - B.E. MZ - 22GE004
		{HallNo: "WW 219", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251MZ129", "7376251MZ143")
		}()},

		// S.No 75 - WW 222 - B.Tech. IT - 22GE004 (arrear)
		{HallNo: "WW 222", CourseCode: "22GE004", RegisterNos: []string{
			"7376232IT146", "7376232IT177", "7376232IT211", "7376232IT224",
			"7376232IT228", "7376232IT248",
		}},

		// S.No 76 - WW 222 - B.Tech. AG - 22GE004 (arrear)
		{HallNo: "WW 222", CourseCode: "22GE004", RegisterNos: []string{
			"7376232AG111", "7376232AG113", "7376232AG129",
			"7376232AG132", "7376232AG144", "7376232AG151",
		}},

		// S.No 77 - WW 222 - B.Tech. AG - 22GE004 (arrear)
		{HallNo: "WW 222", CourseCode: "22GE004", RegisterNos: []string{
			"7376242AG114", "7376242AG119", "7376242AG122",
		}},

		// S.No 78 - WW 222 - B.E. MZ - 22GE004
		{HallNo: "WW 222", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376251MZ144", "7376251MZ162")
		}()},

		// S.No 79 - WW 222 - B.Tech. AG - 22GE004
		{HallNo: "WW 222", CourseCode: "22GE004", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252AG101", "7376252AG113")...)
			r = append(r, expandRange("7376252AG115", "7376252AG117")...)
			return r
		}()},

		// S.No 80 - WW 223 - B.Tech. IT - 22GE004 (arrear)
		{HallNo: "WW 223", CourseCode: "22GE004", RegisterNos: []string{"7376232IT282"}},

		// S.No 81 - WW 223 - B.Tech. AL - 22GE004 (arrear)
		{HallNo: "WW 223", CourseCode: "22GE004", RegisterNos: []string{
			"7376232AL157", "7376232AL183",
		}},

		// S.No 82 - WW 223 - B.Tech. IT - 22GE004 (arrear)
		{HallNo: "WW 223", CourseCode: "22GE004", RegisterNos: []string{
			"7376242IT108", "7376242IT110", "7376242IT113", "7376242IT129",
			"7376242IT141", "7376242IT146", "7376242IT155", "7376242IT164",
			"7376242IT184", "7376242IT188", "7376242IT201", "7376242IT214",
			"7376242IT227", "7376242IT241", "7376242IT250", "7376242IT257",
			"7376242IT297", "7376242IT300", "7376242IT304", "7376242IT318",
			"7376242IT319", "7376242IT324", "7376242IT336", "7376242IT339",
		}},

		// S.No 83 - WW 223 - B.Tech. AL - 22GE004 (arrear)
		{HallNo: "WW 223", CourseCode: "22GE004", RegisterNos: []string{
			"7376242AL104", "7376242AL114", "7376242AL127", "7376242AL128",
			"7376242AL144", "7376242AL156", "7376242AL157", "7376242AL169",
			"7376242AL176", "7376242AL190", "7376242AL193", "7376242AL197", "7376242AL207",
		}},

		// S.No 84 - WW 223 - B.Tech. AG - 22GE004
		{HallNo: "WW 223", CourseCode: "22GE004", RegisterNos: func() []string {
			return expandRange("7376252AG118", "7376252AG127")
		}()},

		// S.No 85 - WW 224 - B.E. CE - 22GE004 (arrear)
		{HallNo: "WW 224", CourseCode: "22GE004", RegisterNos: []string{
			"7376231CE103", "7376231CE117", "7376231CE120",
		}},

		// S.No 86 - WW 224 - B.E. CS - 22GE004 (arrear)
		{HallNo: "WW 224", CourseCode: "22GE004", RegisterNos: []string{
			"7376231CS102", "7376231CS121", "7376231CS235", "7376231CS243", "7376231CS259",
		}},

		// S.No 87 - WW 224 - B.E. SE - 22GE004 (arrear)
		{HallNo: "WW 224", CourseCode: "22GE004", RegisterNos: []string{
			"7376231SE139", "7376231SE144",
		}},

		// S.No 88 - WW 224 - B.Tech. CT - 22GE004 (arrear)
		{HallNo: "WW 224", CourseCode: "22GE004", RegisterNos: []string{"7376232CT122"}},

		// S.No 89 - WW 224 - B.Tech. AL - 22GE004 (arrear)
		{HallNo: "WW 224", CourseCode: "22GE004", RegisterNos: []string{
			"7376242AL208", "7376242AL217", "7376242AL220",
		}},

		// S.No 90 - WW 224 - Ph.D. EC - 24CS22
		{HallNo: "WW 224", CourseCode: "24CS22", RegisterNos: []string{
			"25149697236", "25249697284", "26249691124",
		}},

		// S.No 91 - WW 224 - M.E. IS - 24IS22
		{HallNo: "WW 224", CourseCode: "24IS22", RegisterNos: func() []string {
			return expandRange("7376254IS101", "7376254IS108")
		}()},

		// S.No 92 - WW 224 - B.Tech. IT - 22GE004
		{HallNo: "WW 224", CourseCode: "22GE004", RegisterNos: []string{
			"7376252IT122", "7376252IT128", "7376252IT178", "7376252IT197",
			"7376252IT202", "7376252IT212", "7376252IT222", "7376252IT243",
			"7376252IT253", "7376252IT256", "7376252IT269", "7376252IT297",
			"7376252IT312", "7376252IT313", "7376252IT326", "7376252IT328",
			"7376252IT331", "7376252IT353", "7376252IT376", "7376252IT386",
		}},

		// S.No 93 - WW 224 - B.Tech. AL - 22GE004
		{HallNo: "WW 224", CourseCode: "22GE004", RegisterNos: []string{
			"7376252AL133", "7376252AL162", "7376252AL188", "7376252AL208", "7376252AL231",
		}},

		// S.No 94 - WW 225 - B.E. CS - 22GE004 (arrear)
		{HallNo: "WW 225", CourseCode: "22GE004", RegisterNos: []string{
			"7376231CS288", "7376231CS292", "7376231CS346",
		}},

		// S.No 95 - WW 225 - B.Tech. AD - 22GE004 (arrear)
		{HallNo: "WW 225", CourseCode: "22GE004", RegisterNos: []string{
			"7376232AD119", "7376232AD131", "7376232AD170",
			"7376232AD184", "7376232AD247", "7376232AD250", "7376232AD282",
		}},

		// S.No 96 - WW 225 - B.E. CS - 22GE004 (arrear)
		{HallNo: "WW 225", CourseCode: "22GE004", RegisterNos: []string{
			"7376241CS118", "7376241CS141", "7376241CS143", "7376241CS171",
			"7376241CS185", "7376241CS196", "7376241CS217", "7376241CS230",
			"7376241CS248", "7376241CS257", "7376241CS272", "7376241CS279",
			"7376241CS288", "7376241CS297", "7376241CS307", "7376241CS318",
			"7376241CS323", "7376241CS332", "7376241CS335", "7376241CS350",
			"7376241CS382", "7376241CS395",
		}},

		// S.No 97 - WW 225 - B.Tech. AD - 22GE004 (arrear)
		{HallNo: "WW 225", CourseCode: "22GE004", RegisterNos: []string{
			"7376242AD107", "7376242AD129", "7376242AD137", "7376242AD183",
			"7376242AD189", "7376242AD202", "7376242AD218", "7376242AD291",
			"7376242AD301", "7376242AD308", "7376242AD320", "7376242AD326",
		}},

		// S.No 98 - WW 225 - B.Tech. AD - 22GE004
		{HallNo: "WW 225", CourseCode: "22GE004", RegisterNos: []string{
			"7376252AD104", "7376252AD129", "7376252AD137",
			"7376252AD147", "7376252AD193", "7376252AD200",
		}},

		// S.No 99 - WW 226 - B.E. BM - 22GE004 (arrear)
		{HallNo: "WW 226", CourseCode: "22GE004", RegisterNos: []string{
			"7376231BM107", "7376231BM148",
		}},

		// S.No 100 - WW 226 - B.E. CD - 22GE004 (arrear)
		{HallNo: "WW 226", CourseCode: "22GE004", RegisterNos: []string{"7376231CD143"}},

		// S.No 101 - WW 226 - B.Tech. FD - 22GE004 (arrear)
		{HallNo: "WW 226", CourseCode: "22GE004", RegisterNos: []string{
			"7376232FD107", "7376232FD109", "7376232FD137",
		}},

		// S.No 102 - WW 226 - B.E. CS - 22GE004 (arrear)
		{HallNo: "WW 226", CourseCode: "22GE004", RegisterNos: []string{
			"7376241CS410", "7376241CS455", "7376241CS467", "7376241CS473", "7376241CS474",
		}},

		// S.No 103 - WW 226 - Ph.D. IC - 24CS22
		{HallNo: "WW 226", CourseCode: "24CS22", RegisterNos: []string{
			"25144697545", "25194697305", "25244697473",
			"26224691260", "26234691327", "26244691540",
		}},

		// S.No 104 - WW 226 - M.E. CS - 24CS22
		{HallNo: "WW 226", CourseCode: "24CS22", RegisterNos: func() []string {
			return expandRange("7376254CS101", "7376254CS111")
		}()},

		// S.No 105 - WW 226 - B.E. CS - 22GE004
		{HallNo: "WW 226", CourseCode: "22GE004", RegisterNos: []string{
			"7376251CS124", "7376251CS129", "7376251CS229", "7376251CS260",
			"7376251CS350", "7376251CS385", "7376251CS467", "7376251CS479",
		}},

		// S.No 106 - WW 226 - B.Tech. AD - 22GE004
		{HallNo: "WW 226", CourseCode: "22GE004", RegisterNos: []string{
			"7376252AD214", "7376252AD218", "7376252AD297", "7376252AD326",
		}},
	}
}

// buildSeatingData15June2026AN returns seating records for
// Exam Date: 15-06-2026, Session: AN (01:30 PM to 04:30 PM)
// Course Code: 22HS003 (and 24MB102)
func buildSeatingData15June2026AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 212 - B.E. CS - 22HS003 (arrear)
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{"7376231CS235"}},

		// S.No 2 - EW 212 - B.E. EC - 22HS003 (arrear)
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{
			"7376231EC112", "7376231EC283", "7376231EC331",
		}},

		// S.No 3 - EW 212 - B.E. SE - 22HS003 (arrear)
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{"7376231SE144"}},

		// S.No 4 - EW 212 - B.E. CD - 22HS003 (arrear)
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{"7376241CD501"}},

		// S.No 5 - EW 212 - B.E. MZ - 22HS003 (arrear)
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{"7376231MZ113"}},

		// S.No 6 - EW 212 - B.Tech. CT - 22HS003 (arrear)
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{"7376242CT503"}},

		// S.No 7 - EW 212 - B.E. CS - 22HS003 (arrear)
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{
			"7376241CS143", "7376241CS474",
		}},

		// S.No 8 - EW 212 - B.Tech. IT - 22HS003 (arrear)
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{"7376242IT184"}},

		// S.No 9 - EW 212 - B.Tech. CB - 22HS003 (arrear)
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{
			"7376242CB116", "7376242CB118",
		}},

		// S.No 10 - EW 212 - B.Tech. AD - 22HS003 (arrear)
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{
			"7376242AD189", "7376242AD190", "7376242AD218",
		}},

		// S.No 11 - EW 212 - B.Tech. AL - 22HS003 (arrear)
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{
			"7376242AL197", "7376242AL207",
		}},

		// S.No 12 - EW 212 - M.B.A. - 24MB102
		{HallNo: "EW 212", CourseCode: "24MB102", RegisterNos: []string{
			"7376257MB114", "7376257MB118", "7376257MB123", "7376257MB126",
		}},

		// S.No 13 - EW 212 - B.E. CS - 22HS003
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{
			"7376251CS129", "7376251CS229",
		}},

		// S.No 14 - EW 212 - B.E. EC - 22HS003
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{"7376251EC248"}},

		// S.No 15 - EW 212 - B.E. ME - 22HS003
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{"7376251ME160"}},

		// S.No 16 - EW 212 - B.Tech. BT - 22HS003
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{"7376252BT198"}},

		// S.No 17 - EW 212 - B.Tech. AG - 22HS003
		{HallNo: "EW 212", CourseCode: "22HS003", RegisterNos: []string{"7376252AG114"}},
	}
}

// ─────────────────────────────────────────────────────────────
// 09  19-06-2026  AN  (01:30 PM – 04:30 PM)
// ─────────────────────────────────────────────────────────────
func buildSeatingData09June2026AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1-13 – EW 101 (arrears / special candidates)
		{HallNo: "EW 101", CourseCode: "22HS001", RegisterNos: []string{"7376232IT282"}},
		{HallNo: "EW 101", CourseCode: "24MB104", RegisterNos: []string{"7376247MB133"}},
		{HallNo: "EW 101", CourseCode: "22HS001", RegisterNos: []string{"7376242IT184", "7376242IT214"}},
		{HallNo: "EW 101", CourseCode: "22HS001", RegisterNos: []string{"7376242AD189", "7376242AD301", "7376242AD320"}},
		{HallNo: "EW 101", CourseCode: "22HS001", RegisterNos: []string{"7376242AL144"}},
		{HallNo: "EW 101", CourseCode: "24MB104", RegisterNos: []string{
			"7376257MB101", "7376257MB102", "7376257MB118", "7376257MB123", "7376257MB126",
		}},
		{HallNo: "EW 101", CourseCode: "22HS001", RegisterNos: []string{"7376251CS129", "7376251CS229"}},
		{HallNo: "EW 101", CourseCode: "22HS001", RegisterNos: []string{"7376251EC205"}},
		{HallNo: "EW 101", CourseCode: "22HS001", RegisterNos: []string{"7376251MZ104"}},
		{HallNo: "EW 101", CourseCode: "22HS001", RegisterNos: []string{"7376252BT198"}},
		{HallNo: "EW 101", CourseCode: "22HS001", RegisterNos: []string{"7376252AD137"}},
		{HallNo: "EW 101", CourseCode: "22HS001", RegisterNos: []string{"7376252AL208"}},
		{HallNo: "EW 101", CourseCode: "22HS001", RegisterNos: []string{"7376252AG114"}},
	}
}

// ─────────────────────────────────────────────────────────────
// 08  19-06-2026  FN  (09:00 AM – 12:00 PM)
// ─────────────────────────────────────────────────────────────
func buildSeatingData08June2026FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 – EW 101 – B.E. CS – 22GE003
		{HallNo: "EW 101", CourseCode: "22GE003", RegisterNos: []string{
			"7376231CS190", "7376231CS235", "7376231CS244", "7376231CS259",
			"7376231CS288", "7376231CS292", "7376231CS346",
		}},
		// S.No 2 – EW 101 – B.Tech. IT – 22GE003
		{HallNo: "EW 101", CourseCode: "22GE003", RegisterNos: []string{"7376232IT118", "7376232IT282"}},
		// S.No 3 – EW 101 – B.E. CS – 22GE003
		{HallNo: "EW 101", CourseCode: "22GE003", RegisterNos: []string{
			"7376241CS143", "7376241CS185", "7376241CS230", "7376241CS272", "7376241CS318", "7376241CS395",
		}},
		// S.No 4 – EW 101 – B.Tech. IT – 22GE003
		{HallNo: "EW 101", CourseCode: "22GE003", RegisterNos: []string{
			"7376242IT110", "7376242IT111", "7376242IT129", "7376242IT141",
			"7376242IT146", "7376242IT159", "7376242IT164", "7376242IT184",
		}},
		// S.No 5 – EW 101 – B.E. CS – 22GE003
		{HallNo: "EW 101", CourseCode: "22GE003", RegisterNos: []string{"7376251CS101", "7376251CS102"}},
		// S.No 6 – EW 102 – B.Tech. IT – 22GE003
		{HallNo: "EW 102", CourseCode: "22GE003", RegisterNos: []string{
			"7376242IT214", "7376242IT227", "7376242IT287", "7376242IT292",
			"7376242IT319", "7376242IT335", "7376242IT336", "7376242IT345",
		}},
		// S.No 7 – EW 102 – B.E. CS – 22GE003
		{HallNo: "EW 102", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS103", "7376251CS117")
		}()},
		// S.No 8 – EW 102 – B.Tech. IT – 22GE003
		{HallNo: "EW 102", CourseCode: "22GE003", RegisterNos: []string{"7376252IT102"}},
		// S.No 9 – EW 103 – B.E. CS – 22GE003
		{HallNo: "EW 103", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS134", "7376251CS148")
		}()},
		// S.No 10 – EW 103 – B.Tech. IT – 22GE003
		{HallNo: "EW 103", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT113", "7376252IT122")
		}()},
		// S.No 11 – EW 104 – B.E. CS – 22GE003
		{HallNo: "EW 104", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS195", "7376251CS209")
		}()},
		// S.No 12 – EW 104 – B.Tech. IT – 22GE003
		{HallNo: "EW 104", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT153", "7376252IT162")
		}()},
		// S.No 13 – EW 105 – B.E. CS – 22GE003
		{HallNo: "EW 105", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS210", "7376251CS224")
		}()},
		// S.No 14 – EW 105 – B.Tech. IT – 22GE003
		{HallNo: "EW 105", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT163", "7376252IT172")
		}()},
		// S.No 15 – EW 106 – B.E. CS – 22GE003
		{HallNo: "EW 106", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS256", "7376251CS270")
		}()},
		// S.No 16 – EW 106 – B.Tech. IT – 22GE003
		{HallNo: "EW 106", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT193", "7376252IT202")
		}()},
		// S.No 17 – EW 107 – B.E. CS – 22GE003
		{HallNo: "EW 107", CourseCode: "22GE003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS118", "7376251CS128")...)
			r = append(r, expandRange("7376251CS130", "7376251CS133")...)
			return r
		}()},
		// S.No 18 – EW 107 – B.Tech. IT – 22GE003
		{HallNo: "EW 107", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT103", "7376252IT112")
		}()},
		// S.No 19 – EW 108 – B.E. CS – 22GE003
		{HallNo: "EW 108", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS149", "7376251CS163")
		}()},
		// S.No 20 – EW 108 – B.Tech. IT – 22GE003
		{HallNo: "EW 108", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT123", "7376252IT132")
		}()},
		// S.No 21 – EW 109 – B.E. CS – 22GE003
		{HallNo: "EW 109", CourseCode: "22GE003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS164", "7376251CS168")...)
			r = append(r, expandRange("7376251CS170", "7376251CS179")...)
			return r
		}()},
		// S.No 22 – EW 109 – B.Tech. IT – 22GE003
		{HallNo: "EW 109", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT133", "7376252IT142")
		}()},
		// S.No 23 – EW 111 – B.E. CS – 22GE003
		{HallNo: "EW 111", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS180", "7376251CS194")
		}()},
		// S.No 24 – EW 111 – B.Tech. IT – 22GE003
		{HallNo: "EW 111", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT143", "7376252IT152")
		}()},
		// S.No 25 – EW 112 – B.E. CS – 22GE003
		{HallNo: "EW 112", CourseCode: "22GE003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS225", "7376251CS228")...)
			r = append(r, expandRange("7376251CS230", "7376251CS240")...)
			return r
		}()},
		// S.No 26 – EW 112 – B.Tech. IT – 22GE003
		{HallNo: "EW 112", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT173", "7376252IT182")
		}()},
		// S.No 27 – EW 113 – B.E. CS – 22GE003
		{HallNo: "EW 113", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS391", "7376251CS405")
		}()},
		// S.No 28 – EW 113 – B.Tech. IT – 22GE003
		{HallNo: "EW 113", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT298", "7376252IT307")
		}()},
		// S.No 29 – EW 114 – B.Tech. AD – 22GE003
		{HallNo: "EW 114", CourseCode: "22GE003", RegisterNos: []string{"7376232AD119"}},
		// S.No 30 – EW 114 – B.E. CS – 22GE003
		{HallNo: "EW 114", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS466", "7376251CS479")
		}()},
		// S.No 31 – EW 114 – B.Tech. IT – 22GE003
		{HallNo: "EW 114", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT348", "7376252IT357")
		}()},
		// S.No 32 – EW 115 – B.Tech. AL – 22GE003
		{HallNo: "EW 115", CourseCode: "22GE003", RegisterNos: []string{"7376232AL157"}},
		// S.No 33 – EW 115 – 22GE003 (arrears AL)
		{HallNo: "EW 115", CourseCode: "22GE003", RegisterNos: []string{
			"7376242AL104", "7376242AL109", "7376242AL127",
		}},
		// S.No 34 – EW 115 – B.Tech. IT – 22GE003
		{HallNo: "EW 115", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT383", "7376252IT388")
		}()},
		// S.No 35 – EW 115 – B.Tech. AD – 22GE003
		{HallNo: "EW 115", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD113", "7376252AD127")
		}()},
		// S.No 36 – EW 116 – B.Tech. AL – 22GE003 (arrears)
		{HallNo: "EW 116", CourseCode: "22GE003", RegisterNos: []string{
			"7376242AL157", "7376242AL197", "7376242AL207",
		}},
		// S.No 37 – EW 116 – B.Tech. AD – 22GE003
		{HallNo: "EW 116", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD128", "7376252AD142")
		}()},
		// S.No 38 – EW 116 – B.Tech. AL – 22GE003
		{HallNo: "EW 116", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL101", "7376252AL107")
		}()},
		// S.No 39 – EW 117 – B.Tech. AD – 22GE003
		{HallNo: "EW 117", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD158", "7376252AD172")
		}()},
		// S.No 40 – EW 117 – B.Tech. AL – 22GE003
		{HallNo: "EW 117", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL118", "7376252AL127")
		}()},
		// S.No 41 – EW 118 – B.Tech. AD – 22GE003
		{HallNo: "EW 118", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD188", "7376252AD202")
		}()},
		// S.No 42 – EW 118 – B.Tech. AL – 22GE003
		{HallNo: "EW 118", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL138", "7376252AL147")
		}()},
		// S.No 43 – EW 201 – B.E. CS – 22GE003
		{HallNo: "EW 201", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS286", "7376251CS300")
		}()},
		// S.No 44 – EW 201 – B.Tech. IT – 22GE003
		{HallNo: "EW 201", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT213", "7376252IT222")
		}()},
		// S.No 45 – EW 202 – B.E. CS – 22GE003
		{HallNo: "EW 202", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS316", "7376251CS330")
		}()},
		// S.No 46 – EW 202 – B.Tech. IT – 22GE003
		{HallNo: "EW 202", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT233", "7376252IT242")
		}()},
		// S.No 47 – EW 203 – B.E. CS – 22GE003
		{HallNo: "EW 203", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS406", "7376251CS420")
		}()},
		// S.No 48 – EW 203 – B.Tech. IT – 22GE003
		{HallNo: "EW 203", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT308", "7376252IT317")
		}()},
		// S.No 49 – EW 206 – B.Tech. AD – 22GE003 (arrears)
		{HallNo: "EW 206", CourseCode: "22GE003", RegisterNos: []string{
			"7376232AD122", "7376232AD184", "7376232AD201", "7376232AD247", "7376232AD250",
		}},
		// S.No 50 – EW 206 – 22GE003 (arrears AD)
		{HallNo: "EW 206", CourseCode: "22GE003", RegisterNos: []string{
			"7376242AD107", "7376242AD137", "7376242AD183", "7376242AD189",
			"7376242AD218", "7376242AD291", "7376242AD320", "7376242AD326",
		}},
		// S.No 51 – EW 206 – B.Tech. IT – 22GE003
		{HallNo: "EW 206", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT358", "7376252IT382")
		}()},
		// S.No 52 – EW 206 – B.Tech. AD – 22GE003
		{HallNo: "EW 206", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD101", "7376252AD112")
		}()},
		// S.No 53 – EW 207 – B.E. CS – 22GE003
		{HallNo: "EW 207", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS241", "7376251CS255")
		}()},
		// S.No 54 – EW 207 – B.Tech. IT – 22GE003
		{HallNo: "EW 207", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT183", "7376252IT192")
		}()},
		// S.No 55 – EW 208 – B.E. CS – 22GE003
		{HallNo: "EW 208", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS271", "7376251CS285")
		}()},
		// S.No 56 – EW 208 – B.Tech. IT – 22GE003
		{HallNo: "EW 208", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT203", "7376252IT212")
		}()},
		// S.No 57 – EW 209 – B.E. CS – 22GE003
		{HallNo: "EW 209", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS301", "7376251CS315")
		}()},
		// S.No 58 – EW 209 – B.Tech. IT – 22GE003
		{HallNo: "EW 209", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT223", "7376252IT232")
		}()},
		// S.No 59 – EW 210 – B.E. CS – 22GE003
		{HallNo: "EW 210", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS331", "7376251CS340")
		}()},
		// S.No 60 – EW 210 – B.Tech. IT – 22GE003
		{HallNo: "EW 210", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT243", "7376252IT252")
		}()},
		// S.No 61 – EW 211 – B.E. CS – 22GE003
		{HallNo: "EW 211", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS341", "7376251CS350")
		}()},
		// S.No 62 – EW 211 – B.Tech. IT – 22GE003
		{HallNo: "EW 211", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT253", "7376252IT262")
		}()},
		// S.No 63 – EW 212 – B.E. CS – 22GE003
		{HallNo: "EW 212", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS351", "7376251CS375")
		}()},
		// S.No 64 – EW 212 – B.Tech. IT – 22GE003
		{HallNo: "EW 212", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT263", "7376252IT287")
		}()},
		// S.No 65 – EW 213 – B.Tech. AD – 22GE003
		{HallNo: "EW 213", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD203", "7376252AD217")
		}()},
		// S.No 66 – EW 213 – B.Tech. AL – 22GE003
		{HallNo: "EW 213", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL148", "7376252AL157")
		}()},
		// S.No 67 – EW 214 – B.Tech. AD – 22GE003
		{HallNo: "EW 214", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD218", "7376252AD232")
		}()},
		// S.No 68 – EW 214 – B.Tech. AL – 22GE003
		{HallNo: "EW 214", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL158", "7376252AL167")
		}()},
		// S.No 69 – EW 215 – B.Tech. AD – 22GE003
		{HallNo: "EW 215", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD233", "7376252AD247")
		}()},
		// S.No 70 – EW 215 – B.Tech. AL – 22GE003
		{HallNo: "EW 215", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL168", "7376252AL177")
		}()},
		// S.No 71 – EW 218 – B.Tech. AD – 22GE003
		{HallNo: "EW 218", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD248", "7376252AD272")
		}()},
		// S.No 72 – EW 218 – B.Tech. AL – 22GE003
		{HallNo: "EW 218", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL178", "7376252AL202")
		}()},
		// S.No 73 – WW 005 – B.E. CS – 22GE003
		{HallNo: "WW 005", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS376", "7376251CS390")
		}()},
		// S.No 74 – WW 005 – B.Tech. IT – 22GE003
		{HallNo: "WW 005", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT288", "7376252IT297")
		}()},
		// S.No 75 – WW 006 – B.E. CS – 22GE003
		{HallNo: "WW 006", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS421", "7376251CS435")
		}()},
		// S.No 76 – WW 006 – B.Tech. IT – 22GE003
		{HallNo: "WW 006", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT318", "7376252IT327")
		}()},
		// S.No 77 – WW 007 – B.E. CS – 22GE003
		{HallNo: "WW 007", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS436", "7376251CS450")
		}()},
		// S.No 78 – WW 007 – B.Tech. IT – 22GE003
		{HallNo: "WW 007", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT328", "7376252IT337")
		}()},
		// S.No 79 – WW 008 – B.E. CS – 22GE003
		{HallNo: "WW 008", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376251CS451", "7376251CS465")
		}()},
		// S.No 80 – WW 008 – B.Tech. IT – 22GE003
		{HallNo: "WW 008", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252IT338", "7376252IT347")
		}()},
		// S.No 81 – WW 011 – B.Tech. AD – 22GE003
		{HallNo: "WW 011", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD143", "7376252AD157")
		}()},
		// S.No 82 – WW 011 – B.Tech. AL – 22GE003
		{HallNo: "WW 011", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL108", "7376252AL117")
		}()},
		// S.No 83 – WW 012 – B.Tech. AD – 22GE003
		{HallNo: "WW 012", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD173", "7376252AD187")
		}()},
		// S.No 84 – WW 012 – B.Tech. AL – 22GE003
		{HallNo: "WW 012", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL128", "7376252AL137")
		}()},
		// S.No 85 – WW 218 – B.Tech. AD – 22GE003
		{HallNo: "WW 218", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD273", "7376252AD287")
		}()},
		// S.No 86 – WW 218 – B.Tech. AL – 22GE003
		{HallNo: "WW 218", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL203", "7376252AL212")
		}()},
		// S.No 87 – WW 222 – B.Tech. AD – 22GE003
		{HallNo: "WW 222", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD288", "7376252AD312")
		}()},
		// S.No 88 – WW 222 – B.Tech. AL – 22GE003
		{HallNo: "WW 222", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL213", "7376252AL237")
		}()},
		// S.No 89 – WW 223 – B.E. EC – 22GE003 (arrears)
		{HallNo: "WW 223", CourseCode: "22GE003", RegisterNos: []string{
			"7376241EC139", "7376241EC147", "7376241EC256", "7376241EC273", "7376241EC312", "7376241EC321",
		}},
		// S.No 90 – WW 223 – B.Tech. AD – 22GE003
		{HallNo: "WW 223", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD313", "7376252AD337")
		}()},
		// S.No 91 – WW 223 – B.Tech. AL – 22GE003
		{HallNo: "WW 223", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AL238", "7376252AL246")
		}()},
		// S.No 92 – WW 223 – B.E. EC – 22GE003
		{HallNo: "WW 223", CourseCode: "22GE003", RegisterNos: []string{
			"7376251EC125", "7376251EC141", "7376251EC186", "7376251EC205",
			"7376251EC211", "7376251EC240", "7376251EC248", "7376251EC305",
			"7376251EC335", "7376251EC346",
		}},
		// S.No 93 – WW 224 – B.E. EI – 22GE003 (arrears)
		{HallNo: "WW 224", CourseCode: "22GE003", RegisterNos: []string{"7376231EI128", "7376231EI159"}},
		// S.No 94 – WW 224 – 22GE003 (arrears EI)
		{HallNo: "WW 224", CourseCode: "22GE003", RegisterNos: []string{
			"7376241EI101", "7376241EI123", "7376241EI133", "7376241EI142", "7376241EI146",
		}},
		// S.No 95 – WW 224 – B.Tech. BT – 22GE003 (arrears)
		{HallNo: "WW 224", CourseCode: "22GE003", RegisterNos: []string{"7376242BT145", "7376242BT160"}},
		// S.No 96 – WW 224 – M.E. CS – 24CS24
		{HallNo: "WW 224", CourseCode: "24CS24", RegisterNos: func() []string {
			return expandRange("7376254CS101", "7376254CS111")
		}()},
		// S.No 97 – WW 224 – B.Tech. AD – 22GE003
		{HallNo: "WW 224", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD338", "7376252AD362")
		}()},
		// S.No 98 – WW 224 – B.E. EC – 22GE003
		{HallNo: "WW 224", CourseCode: "22GE003", RegisterNos: []string{"7376251EC347"}},
		// S.No 99 – WW 224 – B.E. EI – 22GE003
		{HallNo: "WW 224", CourseCode: "22GE003", RegisterNos: []string{
			"7376251EI102", "7376251EI126", "7376251EI134", "7376251EI153",
		}},
		// S.No 100 – WW 225 – B.E. SE – 22GE003 (arrears)
		{HallNo: "WW 225", CourseCode: "22GE003", RegisterNos: []string{
			"7376231SE139", "7376231SE144", "7376231SE153",
		}},
		// S.No 101 – WW 225 – B.E. CD – 22GE003 (arrears)
		{HallNo: "WW 225", CourseCode: "22GE003", RegisterNos: []string{"7376231CD115", "7376231CD143"}},
		// S.No 102 – WW 225 – B.Tech. FD – 22GE003 (arrear)
		{HallNo: "WW 225", CourseCode: "22GE003", RegisterNos: []string{"7376232FD137"}},
		// S.No 103 – WW 225 – B.Tech. CB – 22CB202
		{HallNo: "WW 225", CourseCode: "22CB202", RegisterNos: []string{"7376232CB133"}},
		// S.No 104 – WW 225 – M.B.A. – 24MB204
		{HallNo: "WW 225", CourseCode: "24MB204", RegisterNos: []string{"7376247MB137"}},
		// S.No 105 – WW 225 – B.Tech. BT – 22GE003 (arrears)
		{HallNo: "WW 225", CourseCode: "22GE003", RegisterNos: []string{"7376242BT174", "7376242BT182"}},
		// S.No 106 – WW 225 – B.Tech. CB – 22CB202 (arrears)
		{HallNo: "WW 225", CourseCode: "22CB202", RegisterNos: []string{
			"7376242CB116", "7376242CB118", "7376242CB119",
		}},
		// S.No 107 – WW 225 – M.B.A. – 24MB204
		{HallNo: "WW 225", CourseCode: "24MB204", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376257MB101", "7376257MB102")
			r = append(r, expandRange("7376257MB104", "7376257MB117")...)
			return r
		}()},
		// S.No 108 – WW 225 – B.Tech. AD – 22GE003
		{HallNo: "WW 225", CourseCode: "22GE003", RegisterNos: func() []string {
			return expandRange("7376252AD363", "7376252AD381")
		}()},
		// S.No 109 – WW 225 – B.Tech. BT – 22GE003
		{HallNo: "WW 225", CourseCode: "22GE003", RegisterNos: []string{"7376252BT143", "7376252BT198"}},
		// S.No 110 – WW 226 – B.E. EE – 22GE003 (arrears)
		{HallNo: "WW 226", CourseCode: "22GE003", RegisterNos: []string{"7376231EE104", "7376231EE111"}},
		// S.No 111 – WW 226 – B.E. MZ – 22GE003 (arrears)
		{HallNo: "WW 226", CourseCode: "22GE003", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107", "7376231MZ111", "7376231MZ113", "7376231MZ132", "7376231MZ135",
		}},
		// S.No 112 – WW 226 – B.E. EE – 22GE003 (arrears)
		{HallNo: "WW 226", CourseCode: "22GE003", RegisterNos: []string{
			"7376241EE130", "7376241EE132", "7376241EE145", "7376241EE146",
			"7376241EE147", "7376241EE157", "7376241EE188", "7376241EE193",
		}},
		// S.No 113 – WW 226 – M.B.A. – 24MB204
		{HallNo: "WW 226", CourseCode: "24MB204", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376257MB118", "7376257MB123")...)
			r = append(r, expandRange("7376257MB125", "7376257MB147")...)
			return r
		}()},
		// S.No 114 – WW 226 – B.E. EE – 22GE003
		{HallNo: "WW 226", CourseCode: "22GE003", RegisterNos: []string{
			"7376251EE114", "7376251EE138", "7376251EE152", "7376251EE154",
		}},
		// S.No 115 – WW 227 – B.E. ME – 22GE003 (arrear)
		{HallNo: "WW 227", CourseCode: "22GE003", RegisterNos: []string{"7376231ME149"}},
		// S.No 116 – WW 227 – B.E. MZ – 22GE003 (arrear)
		{HallNo: "WW 227", CourseCode: "22GE003", RegisterNos: []string{"7376231MZ148"}},
		// S.No 117 – WW 227 – B.Tech. FT – 22GE003 (arrear)
		{HallNo: "WW 227", CourseCode: "22GE003", RegisterNos: []string{"7376232FT101"}},
		// S.No 118 – WW 227 – B.Tech. CT – 22GE003 (arrears)
		{HallNo: "WW 227", CourseCode: "22GE003", RegisterNos: []string{"7376232CT102", "7376232CT122"}},
		// S.No 119 – WW 227 – B.Tech. AG – 22GE003 (arrear)
		{HallNo: "WW 227", CourseCode: "22GE003", RegisterNos: []string{"7376232AG151"}},
		// S.No 120 – WW 227 – B.E. ME – 22GE003 (arrear)
		{HallNo: "WW 227", CourseCode: "22GE003", RegisterNos: []string{"7376241ME127"}},
		// S.No 121 – WW 227 – B.E. MZ – 22GE003 (arrears)
		{HallNo: "WW 227", CourseCode: "22GE003", RegisterNos: []string{"7376241MZ124", "7376241MZ143"}},
		// S.No 122 – WW 227 – Ph.D. IC – 24CS24
		{HallNo: "WW 227", CourseCode: "24CS24", RegisterNos: []string{
			"25194697305", "26144691211", "26144691534", "26234691327", "26244691201", "26244691520",
		}},
		// S.No 123 – WW 227 – M.E. IS – 24IS24
		{HallNo: "WW 227", CourseCode: "24IS24", RegisterNos: func() []string {
			return expandRange("7376254IS101", "7376254IS108")
		}()},
		// S.No 124 – WW 227 – B.E. ME – 22GE003
		{HallNo: "WW 227", CourseCode: "22GE003", RegisterNos: []string{"7376251ME123", "7376251ME140"}},
		// S.No 125 – WW 227 – B.E. MZ – 22GE003
		{HallNo: "WW 227", CourseCode: "22GE003", RegisterNos: []string{"7376251MZ104", "7376251MZ105"}},
		// S.No 126 – WW 227 – B.Tech. AG – 22GE003
		{HallNo: "WW 227", CourseCode: "22GE003", RegisterNos: []string{"7376252AG114", "7376252AG119"}},
	}
}

// ─────────────────────────────────────────────────────────────
// 07  17-06-2026  AN  (01:30 PM – 04:30 PM)
// ─────────────────────────────────────────────────────────────
func buildSeatingData07June2026AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 – WW 005 – B.E. CS – 22CH103
		{HallNo: "WW 005", CourseCode: "22CH103", RegisterNos: []string{
			"7376231CS190", "7376231CS259", "7376231CS288",
		}},
		// S.No 2 – WW 005 – 22CH103 (arrears CS)
		{HallNo: "WW 005", CourseCode: "22CH103", RegisterNos: []string{
			"7376241CS118", "7376241CS141", "7376241CS143", "7376241CS151",
			"7376241CS185", "7376241CS257", "7376241CS272",
		}},
		// S.No 3 – WW 005 – B.Tech. IT – 22CH103
		{HallNo: "WW 005", CourseCode: "22CH103", RegisterNos: []string{
			"7376242IT108", "7376242IT110", "7376242IT113", "7376242IT129",
			"7376242IT141", "7376242IT146", "7376242IT164", "7376242IT184",
			"7376242IT188", "7376242IT201", "7376242IT214", "7376242IT226",
			"7376242IT227", "7376242IT235", "7376242IT250",
		}},
		// S.No 4 – WW 006 – B.E. CS – 22CH103
		{HallNo: "WW 006", CourseCode: "22CH103", RegisterNos: []string{
			"7376241CS297", "7376241CS307", "7376241CS323", "7376241CS332",
			"7376241CS335", "7376241CS395", "7376241CS455", "7376241CS467",
			"7376241CS474",
		}},
		// S.No 5 – WW 006 – B.Tech. IT – 22CH103
		{HallNo: "WW 006", CourseCode: "22CH103", RegisterNos: []string{
			"7376242IT257", "7376242IT298", "7376242IT300", "7376242IT318",
			"7376242IT319", "7376242IT338", "7376242IT339",
		}},
		// S.No 6 – WW 006 – B.E. CS – 22CH103
		{HallNo: "WW 006", CourseCode: "22CH103", RegisterNos: []string{"7376251CS123"}},
		// S.No 7 – WW 006 – B.Tech. IT – 22CH103
		{HallNo: "WW 006", CourseCode: "22CH103", RegisterNos: []string{
			"7376252IT104", "7376252IT115", "7376252IT122", "7376252IT136",
			"7376252IT155", "7376252IT162", "7376252IT178",
		}},
		// S.No 8 – WW 007 – B.E. CS – 22CH103
		{HallNo: "WW 007", CourseCode: "22CH103", RegisterNos: []string{
			"7376251CS129", "7376251CS163", "7376251CS166", "7376251CS193",
			"7376251CS200", "7376251CS224", "7376251CS229", "7376251CS260",
			"7376251CS268", "7376251CS275",
		}},
		// S.No 9 – WW 007 – B.Tech. IT – 22CH103
		{HallNo: "WW 007", CourseCode: "22CH103", RegisterNos: []string{
			"7376252IT191", "7376252IT197", "7376252IT202", "7376252IT240",
			"7376252IT244", "7376252IT250", "7376252IT253", "7376252IT256",
			"7376252IT291", "7376252IT297", "7376252IT312", "7376252IT326",
			"7376252IT331", "7376252IT345", "7376252IT376",
		}},
		// S.No 10 – WW 008 – B.E. EC – 22CH103
		{HallNo: "WW 008", CourseCode: "22CH103", RegisterNos: []string{
			"7376231EC110", "7376231EC283", "7376231EC334",
		}},
		// S.No 11 – WW 008 – B.Tech. AD – 22CH103
		{HallNo: "WW 008", CourseCode: "22CH103", RegisterNos: []string{"7376232AD122", "7376232AD170"}},
		// S.No 12 – WW 008 – 22CH103 (arrears AD)
		{HallNo: "WW 008", CourseCode: "22CH103", RegisterNos: []string{
			"7376242AD137", "7376242AD183", "7376242AD189", "7376242AD202",
			"7376242AD218", "7376242AD236", "7376242AD291", "7376242AD308",
			"7376242AD320",
		}},
		// S.No 13 – WW 008 – B.E. CS – 22CH103
		{HallNo: "WW 008", CourseCode: "22CH103", RegisterNos: []string{
			"7376251CS336", "7376251CS352", "7376251CS382", "7376251CS387",
			"7376251CS436", "7376251CS467", "7376251CS479",
		}},
		// S.No 14 – WW 008 – B.Tech. AD – 22CH103
		{HallNo: "WW 008", CourseCode: "22CH103", RegisterNos: []string{
			"7376252AD129", "7376252AD137", "7376252AD148", "7376252AD193",
		}},
		// S.No 15 – WW 011 – B.E. EC – 22CH103
		{HallNo: "WW 011", CourseCode: "22CH103", RegisterNos: []string{
			"7376241EC137", "7376241EC139", "7376241EC147", "7376241EC201",
			"7376241EC256", "7376241EC273", "7376241EC282", "7376241EC312",
			"7376241EC321", "7376241EC333",
		}},
		// S.No 16 – WW 011 – B.Tech. AL – 22CH103
		{HallNo: "WW 011", CourseCode: "22CH103", RegisterNos: []string{
			"7376242AL104", "7376242AL109", "7376242AL144",
		}},
		// S.No 17 – WW 011 – B.Tech. AD – 22CH103
		{HallNo: "WW 011", CourseCode: "22CH103", RegisterNos: []string{
			"7376252AD200", "7376252AD214", "7376252AD222", "7376252AD236",
			"7376252AD260", "7376252AD278", "7376252AD297", "7376252AD300",
			"7376252AD315", "7376252AD326", "7376252AD331", "7376252AD372",
		}},
		// S.No 18 – WW 012 – B.E. EE – 22CH103
		{HallNo: "WW 012", CourseCode: "22CH103", RegisterNos: []string{"7376231EE111"}},
		// S.No 19 – WW 012 – B.Tech. AL – 22CH103 (arrears)
		{HallNo: "WW 012", CourseCode: "22CH103", RegisterNos: []string{
			"7376242AL156", "7376242AL157", "7376242AL169", "7376242AL176",
			"7376242AL193", "7376242AL197", "7376242AL207",
		}},
		// S.No 20 – WW 012 – B.E. EC – 22CH103
		{HallNo: "WW 012", CourseCode: "22CH103", RegisterNos: []string{
			"7376251EC141", "7376251EC186", "7376251EC205", "7376251EC213",
			"7376251EC215", "7376251EC248", "7376251EC280", "7376251EC289",
			"7376251EC347",
		}},
		// S.No 21 – WW 012 – B.Tech. AL – 22CH103
		{HallNo: "WW 012", CourseCode: "22CH103", RegisterNos: []string{
			"7376252AL112", "7376252AL115", "7376252AL122", "7376252AL133",
			"7376252AL154", "7376252AL162", "7376252AL186", "7376252AL189",
		}},
		// S.No 22 – WW 218 – B.E. EI – 22CH103
		{HallNo: "WW 218", CourseCode: "22CH103", RegisterNos: []string{"7376231EI128"}},
		// S.No 23 – WW 218 – B.E. MZ – 22CH103
		{HallNo: "WW 218", CourseCode: "22CH103", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107", "7376231MZ111", "7376231MZ113", "7376231MZ132", "7376231MZ135",
		}},
		// S.No 24 – WW 218 – B.E. EE – 22CH103
		{HallNo: "WW 218", CourseCode: "22CH103", RegisterNos: []string{
			"7376241EE132", "7376241EE147", "7376241EE188", "7376241EE193",
		}},
		// S.No 25 – WW 218 – B.E. EI – 22CH103
		{HallNo: "WW 218", CourseCode: "22CH103", RegisterNos: []string{"7376241EI119"}},
		// S.No 26 – WW 218 – B.E. MZ – 22CH103
		{HallNo: "WW 218", CourseCode: "22CH103", RegisterNos: []string{
			"7376241MZ124", "7376241MZ139", "7376241MZ143",
		}},
		// S.No 27 – WW 218 – B.E. EE – 22CH103
		{HallNo: "WW 218", CourseCode: "22CH103", RegisterNos: []string{
			"7376251EE112", "7376251EE114", "7376251EE133", "7376251EE138",
			"7376251EE144", "7376251EE152",
		}},
		// S.No 28 – WW 218 – B.E. MZ – 22CH103
		{HallNo: "WW 218", CourseCode: "22CH103", RegisterNos: []string{"7376251MZ104", "7376251MZ105"}},
		// S.No 29 – WW 218 – B.Tech. AL – 22CH103
		{HallNo: "WW 218", CourseCode: "22CH103", RegisterNos: []string{"7376252AL208", "7376252AL231"}},
		// S.No 30 – WW 219 – B.E. CD – 22CH103
		{HallNo: "WW 219", CourseCode: "22CH103", RegisterNos: []string{"7376231CD115", "7376231CD143"}},
		// S.No 31 – WW 219 – B.Tech. CB – 22CB103
		{HallNo: "WW 219", CourseCode: "22CB103", RegisterNos: []string{
			"7376232CB110", "7376232CB111", "7376232CB123",
		}},
		// S.No 32 – WW 219 – B.Tech. AG – 22CH103
		{HallNo: "WW 219", CourseCode: "22CH103", RegisterNos: []string{"7376232AG151"}},
		// S.No 33 – WW 219 – B.E. EI – 22CH103
		{HallNo: "WW 219", CourseCode: "22CH103", RegisterNos: []string{"7376241EI142", "7376241EI146"}},
		// S.No 34 – WW 219 – B.Tech. BT – 22CH103
		{HallNo: "WW 219", CourseCode: "22CH103", RegisterNos: []string{"7376242BT145"}},
		// S.No 35 – WW 219 – B.Tech. CB – 22CB103
		{HallNo: "WW 219", CourseCode: "22CB103", RegisterNos: []string{
			"7376242CB116", "7376242CB118", "7376242CB154",
		}},
		// S.No 36 – WW 219 – M.B.A. – 24MB103
		{HallNo: "WW 219", CourseCode: "24MB103", RegisterNos: []string{"7376257MB101"}},
		// S.No 37 – WW 219 – B.E. EE – 22CH103
		{HallNo: "WW 219", CourseCode: "22CH103", RegisterNos: []string{
			"7376251EE154", "7376251EE164", "7376251EE170", "7376251EE181", "7376251EE198",
		}},
		// S.No 38 – WW 219 – B.E. EI – 22CH103
		{HallNo: "WW 219", CourseCode: "22CH103", RegisterNos: []string{"7376251EI134", "7376251EI162"}},
		// S.No 39 – WW 219 – B.Tech. AG – 22CH103
		{HallNo: "WW 219", CourseCode: "22CH103", RegisterNos: []string{
			"7376252AG114", "7376252AG117", "7376252AG119", "7376252AG127",
		}},
		// S.No 40 – WW 220 – B.E. BM – 22CH103
		{HallNo: "WW 220", CourseCode: "22CH103", RegisterNos: []string{"7376231BM148"}},
		// S.No 41 – WW 220 – B.E. SE – 22CH103
		{HallNo: "WW 220", CourseCode: "22CH103", RegisterNos: []string{
			"7376231SE122", "7376231SE144", "7376231SE153",
		}},
		// S.No 42 – WW 220 – B.Tech. BT – 22CH103
		{HallNo: "WW 220", CourseCode: "22CH103", RegisterNos: []string{"7376242BT182"}},
		// S.No 43 – WW 220 – 22CH103 (BT)
		{HallNo: "WW 220", CourseCode: "22CH103", RegisterNos: []string{
			"7376252BT120", "7376252BT143", "7376252BT198",
		}},
	}
}

// ─────────────────────────────────────────────────────────────
// 06  17-06-2026  FN  (09:00 AM – 12:00 PM)
// ─────────────────────────────────────────────────────────────
func buildSeatingData06June2026FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 – AE 301 – B.E. CD – 22CD206
		{HallNo: "AE 301", CourseCode: "22CD206", RegisterNos: []string{"7376231CD143"}},
		// S.No 2 – AE 301 – B.Tech. CT – 22CT206
		{HallNo: "AE 301", CourseCode: "22CT206", RegisterNos: []string{"7376232CT122"}},
		// S.No 3 – AE 301 – M.B.A. – 24MB203
		{HallNo: "AE 301", CourseCode: "24MB203", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376257MB101", "7376257MB102")
			r = append(r, expandRange("7376257MB104", "7376257MB109")...)
			return r
		}()},
		// S.No 4 – AE 301 – B.Tech. AD – 22AI206
		{HallNo: "AE 301", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD315", "7376252AD329")
		}()},
		// S.No 5 – AE 302 – B.E. CS – 22CS206
		{HallNo: "AE 302", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS145", "7376251CS159")
		}()},
		// S.No 6 – AE 302 – B.Tech. IT – 22IT206
		{HallNo: "AE 302", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT122", "7376252IT131")
		}()},
		// S.No 7 – EW 107 – B.E. CS – 22CS206
		{HallNo: "EW 107", CourseCode: "22CS206", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS160", "7376251CS168")...)
			r = append(r, expandRange("7376251CS170", "7376251CS175")...)
			return r
		}()},
		// S.No 8 – EW 107 – B.Tech. IT – 22IT206
		{HallNo: "EW 107", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT132", "7376252IT141")
		}()},
		// S.No 9 – EW 108 – B.E. CS – 22CS206
		{HallNo: "EW 108", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS176", "7376251CS190")
		}()},
		// S.No 10 – EW 108 – B.Tech. IT – 22IT206
		{HallNo: "EW 108", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT142", "7376252IT151")
		}()},
		// S.No 11 – EW 109 – B.E. CS – 22CS206
		{HallNo: "EW 109", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS191", "7376251CS205")
		}()},
		// S.No 12 – EW 109 – B.Tech. IT – 22IT206
		{HallNo: "EW 109", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT152", "7376252IT161")
		}()},
		// S.No 13 – EW 111 – B.E. CS – 22CS206
		{HallNo: "EW 111", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS206", "7376251CS220")
		}()},
		// S.No 14 – EW 111 – B.Tech. IT – 22IT206
		{HallNo: "EW 111", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT162", "7376252IT171")
		}()},
		// S.No 15 – EW 112 – B.E. CS – 22CS206
		{HallNo: "EW 112", CourseCode: "22CS206", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS221", "7376251CS228")...)
			r = append(r, expandRange("7376251CS230", "7376251CS236")...)
			return r
		}()},
		// S.No 16 – EW 112 – B.Tech. IT – 22IT206
		{HallNo: "EW 112", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT172", "7376252IT181")
		}()},
		// S.No 17 – EW 113 – B.E. CS – 22CS206
		{HallNo: "EW 113", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS322", "7376251CS336")
		}()},
		// S.No 18 – EW 113 – B.Tech. IT – 22IT206
		{HallNo: "EW 113", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT247", "7376252IT256")
		}()},
		// S.No 19 – EW 114 – B.E. CS – 22CS206
		{HallNo: "EW 114", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS382", "7376251CS396")
		}()},
		// S.No 20 – EW 114 – B.Tech. IT – 22IT206
		{HallNo: "EW 114", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT287", "7376252IT296")
		}()},
		// S.No 21 – EW 115 – B.E. CS – 22CS206
		{HallNo: "EW 115", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS397", "7376251CS411")
		}()},
		// S.No 22 – EW 115 – B.Tech. IT – 22IT206
		{HallNo: "EW 115", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT297", "7376252IT306")
		}()},
		// S.No 23 – EW 116 – B.E. CS – 22CS206
		{HallNo: "EW 116", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS412", "7376251CS426")
		}()},
		// S.No 24 – EW 116 – B.Tech. IT – 22IT206
		{HallNo: "EW 116", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT307", "7376252IT316")
		}()},
		// S.No 25 – EW 117 – B.E. CS – 22CS206
		{HallNo: "EW 117", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS442", "7376251CS456")
		}()},
		// S.No 26 – EW 117 – B.Tech. IT – 22IT206
		{HallNo: "EW 117", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT327", "7376252IT336")
		}()},
		// S.No 27 – EW 118 – B.Tech. AD – 22AI206 (arrears)
		{HallNo: "EW 118", CourseCode: "22AI206", RegisterNos: []string{
			"7376232AD115", "7376232AD174", "7376232AD184", "7376232AD250", "7376232AD269", "7376232AD282",
		}},
		// S.No 28 – EW 118 – 22AI206 (arrear AD)
		{HallNo: "EW 118", CourseCode: "22AI206", RegisterNos: []string{"7376242AD137"}},
		// S.No 29 – EW 118 – B.E. CS – 22CS206
		{HallNo: "EW 118", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS472", "7376251CS479")
		}()},
		// S.No 30 – EW 118 – B.Tech. IT – 22IT206
		{HallNo: "EW 118", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT347", "7376252IT356")
		}()},
		// S.No 31 – EW 207 – B.E. CS – 22CS206
		{HallNo: "EW 207", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS237", "7376251CS251")
		}()},
		// S.No 32 – EW 207 – B.Tech. IT – 22IT206
		{HallNo: "EW 207", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT182", "7376252IT191")
		}()},
		// S.No 33 – EW 208 – B.E. CS – 22CS206
		{HallNo: "EW 208", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS252", "7376251CS266")
		}()},
		// S.No 34 – EW 208 – B.Tech. IT – 22IT206
		{HallNo: "EW 208", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT192", "7376252IT201")
		}()},
		// S.No 35 – EW 209 – B.E. CS – 22CS206
		{HallNo: "EW 209", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS267", "7376251CS281")
		}()},
		// S.No 36 – EW 209 – B.Tech. IT – 22IT206
		{HallNo: "EW 209", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT202", "7376252IT211")
		}()},
		// S.No 37 – EW 212 – B.E. CS – 22CS206
		{HallNo: "EW 212", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS282", "7376251CS306")
		}()},
		// S.No 38 – EW 212 – B.Tech. IT – 22IT206
		{HallNo: "EW 212", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT212", "7376252IT236")
		}()},
		// S.No 39 – EW 213 – B.Tech. AD – 22AI206 (arrears)
		{HallNo: "EW 213", CourseCode: "22AI206", RegisterNos: []string{
			"7376242AD146", "7376242AD183", "7376242AD189", "7376242AD190",
			"7376242AD218", "7376242AD291", "7376242AD301", "7376242AD308",
			"7376242AD320", "7376242AD322", "7376242AD326",
		}},
		// S.No 40 – EW 213 – B.Tech. IT – 22IT206
		{HallNo: "EW 213", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT357", "7376252IT366")
		}()},
		// S.No 41 – EW 213 – B.Tech. AD – 22AI206
		{HallNo: "EW 213", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD101", "7376252AD104")
		}()},
		// S.No 42 – EW 214 – B.Tech. IT – 22IT206
		{HallNo: "EW 214", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT367", "7376252IT376")
		}()},
		// S.No 43 – EW 214 – B.Tech. AD – 22AI206
		{HallNo: "EW 214", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD105", "7376252AD119")
		}()},
		// S.No 44 – EW 215 – B.Tech. IT – 22IT206
		{HallNo: "EW 215", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT377", "7376252IT386")
		}()},
		// S.No 45 – EW 215 – B.Tech. AD – 22AI206
		{HallNo: "EW 215", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD120", "7376252AD134")
		}()},
		// S.No 46 – EW 218 – B.Tech. AL – 22AM206 (arrear)
		{HallNo: "EW 218", CourseCode: "22AM206", RegisterNos: []string{"7376232AL183"}},
		// S.No 47 – EW 218 – 22AM206 (arrears AL)
		{HallNo: "EW 218", CourseCode: "22AM206", RegisterNos: []string{
			"7376242AL104", "7376242AL127", "7376242AL144", "7376242AL157",
			"7376242AL190", "7376242AL193", "7376242AL197", "7376242AL207",
			"7376242AL220",
		}},
		// S.No 48 – EW 218 – B.Tech. IT – 22IT206
		{HallNo: "EW 218", CourseCode: "22IT206", RegisterNos: []string{"7376252IT387", "7376252IT388"}},
		// S.No 49 – EW 218 – B.Tech. AD – 22AI206
		{HallNo: "EW 218", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD135", "7376252AD159")
		}()},
		// S.No 50 – EW 218 – B.Tech. AL – 22AM206
		{HallNo: "EW 218", CourseCode: "22AM206", RegisterNos: func() []string {
			return expandRange("7376252AL101", "7376252AL113")
		}()},
		// S.No 51 – MH 302 – B.E. CS – 22CS206 (arrears)
		{HallNo: "MH 302", CourseCode: "22CS206", RegisterNos: []string{"7376241CS395", "7376241CS467"}},
		// S.No 52 – MH 302 – B.Tech. IT – 22IT206 (arrears)
		{HallNo: "MH 302", CourseCode: "22IT206", RegisterNos: []string{
			"7376242IT146", "7376242IT155", "7376242IT164", "7376242IT184",
			"7376242IT188", "7376242IT214", "7376242IT227", "7376242IT287",
			"7376242IT318",
		}},
		// S.No 53 – MH 302 – B.E. CS – 22CS206
		{HallNo: "MH 302", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS101", "7376251CS113")
		}()},
		// S.No 54 – MH 303 – 22CS206
		{HallNo: "MH 303", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS114", "7376251CS128")
		}()},
		// S.No 55 – MH 303 – B.Tech. IT – 22IT206
		{HallNo: "MH 303", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT102", "7376252IT111")
		}()},
		// S.No 56 – MH 305 – B.E. CS – 22CS206
		{HallNo: "MH 305", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS130", "7376251CS144")
		}()},
		// S.No 57 – MH 305 – B.Tech. IT – 22IT206
		{HallNo: "MH 305", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT112", "7376252IT121")
		}()},
		// S.No 58 – MH 306 – B.E. CS – 22CS206 (arrears)
		{HallNo: "MH 306", CourseCode: "22CS206", RegisterNos: []string{
			"7376231CS121", "7376231CS173", "7376231CS190", "7376231CS244",
			"7376231CS259", "7376231CS288",
		}},
		// S.No 59 – MH 306 – B.Tech. IT – 22IT206 (arrears)
		{HallNo: "MH 306", CourseCode: "22IT206", RegisterNos: []string{
			"7376232IT118", "7376232IT152", "7376232IT162", "7376232IT224",
			"7376232IT228", "7376232IT282",
		}},
		// S.No 60 – MH 306 – B.E. CS – 22CS206 (arrears)
		{HallNo: "MH 306", CourseCode: "22CS206", RegisterNos: []string{
			"7376241CS123", "7376241CS171", "7376241CS220", "7376241CS230",
			"7376241CS257", "7376241CS272", "7376241CS318", "7376241CS323",
			"7376241CS332",
		}},
		// S.No 61 – MH 306 – B.Tech. IT – 22IT206 (arrears)
		{HallNo: "MH 306", CourseCode: "22IT206", RegisterNos: []string{
			"7376242IT108", "7376242IT110", "7376242IT139", "7376242IT141",
		}},
		// S.No 62 – SF B01 – M.B.A. – 24MB203
		{HallNo: "SF B01", CourseCode: "24MB203", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376257MB110", "7376257MB123")...)
			r = append(r, expandRange("7376257MB125", "7376257MB130")...)
			return r
		}()},
		// S.No 63 – SF B01 – B.Tech. AD – 22AI206
		{HallNo: "SF B01", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD330", "7376252AD349")
		}()},
		// S.No 64 – SF B02 – M.E. IS – 24IS23
		{HallNo: "SF B02", CourseCode: "24IS23", RegisterNos: func() []string {
			return expandRange("7376254IS101", "7376254IS103")
		}()},
		// S.No 65 – SF B02 – M.B.A. – 24MB203
		{HallNo: "SF B02", CourseCode: "24MB203", RegisterNos: func() []string {
			return expandRange("7376257MB131", "7376257MB147")
		}()},
		// S.No 66 – SF B02 – B.Tech. AD – 22AI206
		{HallNo: "SF B02", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD350", "7376252AD369")
		}()},
		// S.No 67 – SF B03 – B.E. SE – 22IS206
		{HallNo: "SF B03", CourseCode: "22IS206", RegisterNos: []string{"7376231SE122", "7376231SE144"}},
		// S.No 68 – SF B03 – Ph.D. IC – 24CS23
		{HallNo: "SF B03", CourseCode: "24CS23", RegisterNos: []string{"25244691339"}},
		// S.No 69 – SF B03 – M.E. IS – 24IS23
		{HallNo: "SF B03", CourseCode: "24IS23", RegisterNos: func() []string {
			return expandRange("7376254IS104", "7376254IS108")
		}()},
		// S.No 70 – SF B03 – B.Tech. AD – 22AI206
		{HallNo: "SF B03", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD370", "7376252AD381")
		}()},
		// S.No 71 – WW 005 – B.E. CS – 22CS206
		{HallNo: "WW 005", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS307", "7376251CS321")
		}()},
		// S.No 72 – WW 005 – B.Tech. IT – 22IT206
		{HallNo: "WW 005", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT237", "7376252IT246")
		}()},
		// S.No 73 – WW 006 – B.E. CS – 22CS206
		{HallNo: "WW 006", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS337", "7376251CS351")
		}()},
		// S.No 74 – WW 006 – B.Tech. IT – 22IT206
		{HallNo: "WW 006", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT257", "7376252IT266")
		}()},
		// S.No 75 – WW 007 – B.E. CS – 22CS206
		{HallNo: "WW 007", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS352", "7376251CS366")
		}()},
		// S.No 76 – WW 007 – B.Tech. IT – 22IT206
		{HallNo: "WW 007", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT267", "7376252IT276")
		}()},
		// S.No 77 – WW 008 – B.E. CS – 22CS206
		{HallNo: "WW 008", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS367", "7376251CS381")
		}()},
		// S.No 78 – WW 008 – B.Tech. IT – 22IT206
		{HallNo: "WW 008", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT277", "7376252IT286")
		}()},
		// S.No 79 – WW 011 – B.E. CS – 22CS206
		{HallNo: "WW 011", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS427", "7376251CS441")
		}()},
		// S.No 80 – WW 011 – B.Tech. IT – 22IT206
		{HallNo: "WW 011", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT317", "7376252IT326")
		}()},
		// S.No 81 – WW 012 – B.E. CS – 22CS206
		{HallNo: "WW 012", CourseCode: "22CS206", RegisterNos: func() []string {
			return expandRange("7376251CS457", "7376251CS471")
		}()},
		// S.No 82 – WW 012 – B.Tech. IT – 22IT206
		{HallNo: "WW 012", CourseCode: "22IT206", RegisterNos: func() []string {
			return expandRange("7376252IT337", "7376252IT346")
		}()},
		// S.No 83 – WW 218 – B.Tech. AD – 22AI206
		{HallNo: "WW 218", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD160", "7376252AD174")
		}()},
		// S.No 84 – WW 218 – B.Tech. AL – 22AM206
		{HallNo: "WW 218", CourseCode: "22AM206", RegisterNos: func() []string {
			return expandRange("7376252AL114", "7376252AL123")
		}()},
		// S.No 85 – WW 219 – B.Tech. AD – 22AI206
		{HallNo: "WW 219", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD175", "7376252AD189")
		}()},
		// S.No 86 – WW 219 – B.Tech. AL – 22AM206
		{HallNo: "WW 219", CourseCode: "22AM206", RegisterNos: func() []string {
			return expandRange("7376252AL124", "7376252AL133")
		}()},
		// S.No 87 – WW 222 – B.Tech. AD – 22AI206
		{HallNo: "WW 222", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD190", "7376252AD214")
		}()},
		// S.No 88 – WW 222 – B.Tech. AL – 22AM206
		{HallNo: "WW 222", CourseCode: "22AM206", RegisterNos: func() []string {
			return expandRange("7376252AL134", "7376252AL158")
		}()},
		// S.No 89 – WW 223 – B.Tech. AD – 22AI206
		{HallNo: "WW 223", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD215", "7376252AD239")
		}()},
		// S.No 90 – WW 223 – B.Tech. AL – 22AM206
		{HallNo: "WW 223", CourseCode: "22AM206", RegisterNos: func() []string {
			return expandRange("7376252AL159", "7376252AL183")
		}()},
		// S.No 91 – WW 224 – B.Tech. AD – 22AI206
		{HallNo: "WW 224", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD240", "7376252AD264")
		}()},
		// S.No 92 – WW 224 – B.Tech. AL – 22AM206
		{HallNo: "WW 224", CourseCode: "22AM206", RegisterNos: func() []string {
			return expandRange("7376252AL184", "7376252AL208")
		}()},
		// S.No 93 – WW 225 – B.Tech. AD – 22AI206
		{HallNo: "WW 225", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD265", "7376252AD289")
		}()},
		// S.No 94 – WW 225 – B.Tech. AL – 22AM206
		{HallNo: "WW 225", CourseCode: "22AM206", RegisterNos: func() []string {
			return expandRange("7376252AL209", "7376252AL233")
		}()},
		// S.No 95 – WW 226 – B.E. CD – 22CD206
		{HallNo: "WW 226", CourseCode: "22CD206", RegisterNos: []string{"7376231CD107"}},
		// S.No 96 – WW 226 – M.E. CS – 24CS23
		{HallNo: "WW 226", CourseCode: "24CS23", RegisterNos: func() []string {
			return expandRange("7376254CS101", "7376254CS111")
		}()},
		// S.No 97 – WW 226 – B.Tech. AD – 22AI206
		{HallNo: "WW 226", CourseCode: "22AI206", RegisterNos: func() []string {
			return expandRange("7376252AD290", "7376252AD314")
		}()},
		// S.No 98 – WW 226 – B.Tech. AL – 22AM206
		{HallNo: "WW 226", CourseCode: "22AM206", RegisterNos: func() []string {
			return expandRange("7376252AL234", "7376252AL246")
		}()},
	}
}

// buildSeatingData22June2026FN returns seating records for 22-06-2026 FN session (09:00 AM to 12:00 PM)
func buildSeatingData22June2026FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 301 - B.E. EI - 22MA201
		{HallNo: "AE 301", CourseCode: "22MA201", RegisterNos: []string{"7376241EI142"}},

		// S.No 2 - AE 301 - M.B.A. - 24MB205
		{HallNo: "AE 301", CourseCode: "24MB205", RegisterNos: func() []string {
			return expandRange("7376257MB104", "7376257MB118")
		}()},

		// S.No 3 - AE 301 - B.E. EI - 22MA201
		{HallNo: "AE 301", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EI101", "7376251EI109")
		}()},

		// S.No 4 - AE 302 - B.E. CS - 22MA201
		{HallNo: "AE 302", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS181", "7376251CS195")
		}()},

		// S.No 5 - AE 302 - B.Tech. IT - 22MA201
		{HallNo: "AE 302", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT169", "7376252IT178")
		}()},

		// S.No 6 - EW 101 - B.E. CS - 22MA201
		{HallNo: "EW 101", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS196", "7376251CS210")
		}()},

		// S.No 7 - EW 101 - B.Tech. IT - 22MA201
		{HallNo: "EW 101", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT179", "7376252IT188")
		}()},

		// S.No 8 - EW 102 - B.E. CS - 22MA201
		{HallNo: "EW 102", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS211", "7376251CS225")
		}()},

		// S.No 9 - EW 102 - B.Tech. IT - 22MA201
		{HallNo: "EW 102", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT189", "7376252IT198")
		}()},

		// S.No 10 - EW 103 - B.E. CS - 22MA201
		{HallNo: "EW 103", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS272", "7376251CS286")
		}()},

		// S.No 11 - EW 103 - B.Tech. IT - 22MA201
		{HallNo: "EW 103", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT229", "7376252IT238")
		}()},

		// S.No 12 - EW 104 - B.E. CS - 22MA201
		{HallNo: "EW 104", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS362", "7376251CS376")
		}()},

		// S.No 13 - EW 104 - B.Tech. IT - 22MA201
		{HallNo: "EW 104", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT289", "7376252IT298")
		}()},

		// S.No 14 - EW 105 - B.E. CS - 22MA201
		{HallNo: "EW 105", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS377", "7376251CS391")
		}()},

		// S.No 15 - EW 105 - B.Tech. IT - 22MA201
		{HallNo: "EW 105", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT299", "7376252IT308")
		}()},

		// S.No 16 - EW 106 - B.E. CS - 22MA201
		{HallNo: "EW 106", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS452", "7376251CS466")
		}()},

		// S.No 17 - EW 106 - B.Tech. IT - 22MA201
		{HallNo: "EW 106", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT349", "7376252IT358")
		}()},

		// S.No 18 - EW 107 - B.E. CS - 22MA201
		{HallNo: "EW 107", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS242", "7376251CS256")
		}()},

		// S.No 19 - EW 107 - B.Tech. IT - 22MA201
		{HallNo: "EW 107", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT209", "7376252IT218")
		}()},

		// S.No 20 - EW 108 - B.E. CS - 22MA201
		{HallNo: "EW 108", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS287", "7376251CS301")
		}()},

		// S.No 21 - EW 108 - B.Tech. IT - 22MA201
		{HallNo: "EW 108", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT239", "7376252IT248")
		}()},

		// S.No 22 - EW 109 - B.E. CS - 22MA201
		{HallNo: "EW 109", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS317", "7376251CS331")
		}()},

		// S.No 23 - EW 109 - B.Tech. IT - 22MA201
		{HallNo: "EW 109", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT259", "7376252IT268")
		}()},

		// S.No 24 - EW 111 - B.E. CS - 22MA201
		{HallNo: "EW 111", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS347", "7376251CS361")
		}()},

		// S.No 25 - EW 111 - B.Tech. IT - 22MA201
		{HallNo: "EW 111", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT279", "7376252IT288")
		}()},

		// S.No 26 - EW 112 - B.E. CS - 22MA201
		{HallNo: "EW 112", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS392", "7376251CS406")
		}()},

		// S.No 27 - EW 112 - B.Tech. IT - 22MA201
		{HallNo: "EW 112", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT309", "7376252IT318")
		}()},

		// S.No 28 - EW 113 - B.E. EC - 22MA201
		{HallNo: "EW 113", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC169", "7376251EC178")
		}()},

		// S.No 29 - EW 113 - B.Tech. AD - 22MA201
		{HallNo: "EW 113", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD241", "7376252AD255")
		}()},

		// S.No 30 - EW 114 - B.E. EC - 22MA201
		{HallNo: "EW 114", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC229", "7376251EC238")
		}()},

		// S.No 31 - EW 114 - B.Tech. AD - 22MA201
		{HallNo: "EW 114", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD326", "7376252AD340")
		}()},

		// S.No 32 - EW 115 - B.Tech. AL - 22MA201
		{HallNo: "EW 115", CourseCode: "22MA201", RegisterNos: []string{
			"7376232AL157", "7376232AL158",
		}},

		// S.No 33 - EW 115 - B.Tech. AL - 22MA201
		{HallNo: "EW 115", CourseCode: "22MA201", RegisterNos: []string{
			"7376242AL104", "7376242AL108",
			"7376242AL109", "7376242AL114",
			"7376242AL127", "7376242AL128",
			"7376242AL144",
		}},

		// S.No 34 - EW 115 - B.E. EC - 22MA201
		{HallNo: "EW 115", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC274", "7376251EC283")
		}()},

		// S.No 35 - EW 115 - B.Tech. AD - 22MA201
		{HallNo: "EW 115", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD376", "7376252AD381")
		}()},

		// S.No 36 - EW 116 - B.Tech. AL - 22MA201
		{HallNo: "EW 116", CourseCode: "22MA201", RegisterNos: []string{
			"7376242AL157", "7376242AL163",
			"7376242AL169", "7376242AL190",
			"7376242AL193", "7376242AL197",
			"7376242AL202", "7376242AL207",
			"7376242AL208", "7376242AL220",
		}},

		// S.No 37 - EW 116 - B.E. EC - 22MA201
		{HallNo: "EW 116", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC284", "7376251EC293")
		}()},

		// S.No 38 - EW 116 - B.Tech. AL - 22MA201
		{HallNo: "EW 116", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AL101", "7376252AL105")
		}()},

		// S.No 39 - EW 117 - B.E. EC - 22MA201
		{HallNo: "EW 117", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC304", "7376251EC313")
		}()},

		// S.No 40 - EW 117 - B.Tech. AL - 22MA201
		{HallNo: "EW 117", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AL121", "7376252AL135")
		}()},

		// S.No 41 - EW 118 - B.E. EC - 22MA201
		{HallNo: "EW 118", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC324", "7376251EC333")
		}()},

		// S.No 42 - EW 118 - B.Tech. AL - 22MA201
		{HallNo: "EW 118", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AL151", "7376252AL165")
		}()},

		// S.No 43 - EW 201 - B.Tech. AD - 22MA201
		{HallNo: "EW 201", CourseCode: "22MA201", RegisterNos: []string{
			"7376232AD174", "7376232AD184",
			"7376232AD209", "7376232AD250",
			"7376232AD269", "7376232AD282",
		}},

		// S.No 44 - EW 201 - B.Tech. AD - 22MA201
		{HallNo: "EW 201", CourseCode: "22MA201", RegisterNos: []string{
			"7376242AD118", "7376242AD129",
			"7376242AD137", "7376242AD146",
			"7376242AD153", "7376242AD183",
			"7376242AD186", "7376242AD189",
			"7376242AD190",
		}},

		// S.No 45 - EW 201 - B.Tech. IT - 22MA201
		{HallNo: "EW 201", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT369", "7376252IT378")
		}()},

		// S.No 46 - EW 202 - B.E. EC - 22MA201
		{HallNo: "EW 202", CourseCode: "22MA201", RegisterNos: []string{
			"7376231EC101", "7376231EC110",
			"7376231EC112", "7376231EC196",
			"7376231EC231", "7376231EC243",
			"7376231EC283", "7376231EC297",
			"7376231EC305", "7376231EC318",
		}},

		// S.No 47 - EW 202 - B.Tech. AD - 22MA201
		{HallNo: "EW 202", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD101", "7376252AD115")
		}()},

		// S.No 48 - EW 203 - B.E. EC - 22MA201
		{HallNo: "EW 203", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC179", "7376251EC188")
		}()},

		// S.No 49 - EW 203 - B.Tech. AD - 22MA201
		{HallNo: "EW 203", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD256", "7376252AD270")
		}()},

		// S.No 50 - EW 204 - B.E. EC - 22MA201
		{HallNo: "EW 204", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC209", "7376251EC218")
		}()},

		// S.No 51 - EW 204 - B.Tech. AD - 22MA201
		{HallNo: "EW 204", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD301", "7376252AD310")
		}()},

		// S.No 52 - EW 205 - B.E. EC - 22MA201
		{HallNo: "EW 205", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC239", "7376251EC248")
		}()},

		// S.No 53 - EW 205 - B.Tech. AD - 22MA201
		{HallNo: "EW 205", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD341", "7376252AD350")
		}()},

		// S.No 54 - EW 206 - B.E. EC - 22MA201
		{HallNo: "EW 206", CourseCode: "22MA201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EC249", "7376251EC269")...)
			r = append(r, expandRange("7376251EC271", "7376251EC273")...)
			return r
		}()},

		// S.No 55 - EW 206 - B.Tech. AD - 22MA201
		{HallNo: "EW 206", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD351", "7376252AD375")
		}()},

		// S.No 56 - EW 207 - B.E. CS - 22MA201
		{HallNo: "EW 207", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS437", "7376251CS451")
		}()},

		// S.No 57 - EW 207 - B.Tech. IT - 22MA201
		{HallNo: "EW 207", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT339", "7376252IT348")
		}()},

		// S.No 58 - EW 208 - B.Tech. AD - 22MA201
		{HallNo: "EW 208", CourseCode: "22MA201", RegisterNos: []string{
			"7376232AD115", "7376232AD122",
		}},

		// S.No 59 - EW 208 - B.E. CS - 22MA201
		{HallNo: "EW 208", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS467", "7376251CS479")
		}()},

		// S.No 60 - EW 208 - B.Tech. IT - 22MA201
		{HallNo: "EW 208", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT359", "7376252IT368")
		}()},

		// S.No 61 - EW 209 - B.Tech. AD - 22MA201
		{HallNo: "EW 209", CourseCode: "22MA201", RegisterNos: []string{
			"7376242AD202", "7376242AD209",
			"7376242AD218", "7376242AD226",
			"7376242AD236", "7376242AD254",
			"7376242AD267", "7376242AD291",
			"7376242AD301", "7376242AD308",
			"7376242AD311", "7376242AD314",
			"7376242AD320", "7376242AD326",
			"7376242AD343",
		}},

		// S.No 62 - EW 209 - B.Tech. IT - 22MA201
		{HallNo: "EW 209", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT379", "7376252IT388")
		}()},

		// S.No 63 - EW 210 - B.E. EC - 22MA201
		{HallNo: "EW 210", CourseCode: "22MA201", RegisterNos: []string{
			"7376241EC145", "7376241EC151",
			"7376241EC160", "7376241EC163",
			"7376241EC167", "7376241EC171",
			"7376241EC177", "7376241EC201",
			"7376241EC206", "7376241EC209",
		}},

		// S.No 64 - EW 210 - B.Tech. AD - 22MA201
		{HallNo: "EW 210", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD131", "7376252AD140")
		}()},

		// S.No 65 - EW 211 - B.E. EC - 22MA201
		{HallNo: "EW 211", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC114", "7376251EC123")
		}()},

		// S.No 66 - EW 211 - B.Tech. AD - 22MA201
		{HallNo: "EW 211", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD181", "7376252AD190")
		}()},

		// S.No 67 - EW 212 - B.E. EC - 22MA201
		{HallNo: "EW 212", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC124", "7376251EC148")
		}()},

		// S.No 68 - EW 212 - B.Tech. AD - 22MA201
		{HallNo: "EW 212", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD191", "7376252AD215")
		}()},

		// S.No 69 - EW 213 - B.E. EC - 22MA201
		{HallNo: "EW 213", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC334", "7376251EC343")
		}()},

		// S.No 70 - EW 213 - B.Tech. AL - 22MA201
		{HallNo: "EW 213", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AL166", "7376252AL180")
		}()},

		// S.No 71 - EW 214 - B.Tech. BT - 22MA201
		{HallNo: "EW 214", CourseCode: "22MA201", RegisterNos: []string{"7376232BT124"}},

		// S.No 72 - EW 214 - B.E. EC - 22MA201
		{HallNo: "EW 214", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC344", "7376251EC352")
		}()},

		// S.No 73 - EW 214 - B.Tech. AL - 22MA201
		{HallNo: "EW 214", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AL181", "7376252AL195")
		}()},

		// S.No 74 - EW 215 - B.Tech. BT - 22MA201
		{HallNo: "EW 215", CourseCode: "22MA201", RegisterNos: []string{
			"7376232BT134", "7376232BT137",
			"7376232BT142", "7376232BT148",
			"7376232BT170", "7376232BT176",
			"7376232BT201", "7376232BT204",
			"7376232BT209",
		}},

		// S.No 75 - EW 215 - B.Tech. BT - 22MA201
		{HallNo: "EW 215", CourseCode: "22MA201", RegisterNos: []string{"7376242BT120"}},

		// S.No 76 - EW 215 - B.Tech. AL - 22MA201
		{HallNo: "EW 215", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AL196", "7376252AL210")
		}()},

		// S.No 77 - EW 216 - B.Tech. BT - 22MA201
		{HallNo: "EW 216", CourseCode: "22MA201", RegisterNos: []string{
			"7376242BT123", "7376242BT145",
			"7376242BT151", "7376242BT156",
			"7376242BT160", "7376242BT172",
			"7376242BT174", "7376242BT178",
			"7376242BT182", "7376242BT186",
		}},

		// S.No 78 - EW 216 - B.Tech. AL - 22MA201
		{HallNo: "EW 216", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AL211", "7376252AL220")
		}()},

		// S.No 79 - EW 217 - B.Tech. BT - 22MA201
		{HallNo: "EW 217", CourseCode: "22MA201", RegisterNos: []string{
			"7376242BT192", "7376242BT219", "7376242BT220",
		}},

		// S.No 80 - EW 217 - B.Tech. BT - 22MA201
		{HallNo: "EW 217", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252BT102", "7376252BT108")
		}()},

		// S.No 81 - EW 217 - B.Tech. AL - 22MA201
		{HallNo: "EW 217", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AL221", "7376252AL230")
		}()},

		// S.No 82 - EW 218 - B.E. EE - 22MA201
		{HallNo: "EW 218", CourseCode: "22MA201", RegisterNos: []string{
			"7376231EE104", "7376231EE111",
			"7376231EE112", "7376231EE115",
			"7376231EE159", "7376231EE160",
		}},

		// S.No 83 - EW 218 - B.E. EE - 22MA201
		{HallNo: "EW 218", CourseCode: "22MA201", RegisterNos: []string{
			"7376241EE115", "7376241EE127", "7376241EE130",
		}},

		// S.No 84 - EW 218 - B.Tech. BT - 22MA201
		{HallNo: "EW 218", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252BT109", "7376252BT133")
		}()},

		// S.No 85 - EW 218 - B.Tech. AL - 22MA201
		{HallNo: "EW 218", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AL231", "7376252AL246")
		}()},

		// S.No 86 - MECH DH - B.E. CS - 22MA201
		{HallNo: "MECH DH", CourseCode: "22MA201", RegisterNos: []string{
			"7376231CS288", "7376231CS292", "7376231CS295",
		}},

		// S.No 87 - MECH DH - B.Tech. IT - 22MA201
		{HallNo: "MECH DH", CourseCode: "22MA201", RegisterNos: []string{"7376232IT282"}},

		// S.No 88 - MECH DH - B.E. CS - 22MA201
		{HallNo: "MECH DH", CourseCode: "22MA201", RegisterNos: []string{
			"7376241CS103", "7376241CS118",
			"7376241CS123", "7376241CS135",
			"7376241CS141", "7376241CS143",
			"7376241CS150", "7376241CS159",
			"7376241CS171", "7376241CS190",
			"7376241CS196", "7376241CS197",
			"7376241CS206", "7376241CS217",
			"7376241CS220", "7376241CS223",
			"7376241CS230", "7376241CS237",
			"7376241CS248", "7376241CS249",
			"7376241CS257", "7376241CS272",
			"7376241CS279", "7376241CS294",
			"7376241CS297", "7376241CS318",
			"7376241CS323", "7376241CS332",
			"7376241CS395", "7376241CS406",
			"7376241CS409", "7376241CS425",
			"7376241CS450", "7376241CS455",
			"7376241CS467", "7376241CS473",
		}},

		// S.No 89 - MECH DH - B.Tech. IT - 22MA201
		{HallNo: "MECH DH", CourseCode: "22MA201", RegisterNos: []string{
			"7376242IT108", "7376242IT110",
			"7376242IT111", "7376242IT129",
			"7376242IT139", "7376242IT141",
			"7376242IT146", "7376242IT155",
			"7376242IT161", "7376242IT164",
			"7376242IT168", "7376242IT184",
			"7376242IT188", "7376242IT209",
			"7376242IT214", "7376242IT217",
			"7376242IT226", "7376242IT227",
			"7376242IT257", "7376242IT260",
			"7376242IT273", "7376242IT287",
			"7376242IT292", "7376242IT293",
			"7376242IT294", "7376242IT297",
			"7376242IT300", "7376242IT313",
			"7376242IT319", "7376242IT337",
			"7376242IT339", "7376242IT341",
			"7376242IT342",
		}},

		// S.No 90 - MECH DH - B.E. CS - 22MA201
		{HallNo: "MECH DH", CourseCode: "22MA201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS101", "7376251CS128")...)
			r = append(r, expandRange("7376251CS130", "7376251CS134")...)
			return r
		}()},

		// S.No 91 - MECH DH - B.Tech. IT - 22MA201
		{HallNo: "MECH DH", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT102", "7376252IT138")
		}()},

		// S.No 92 - MH 302 - B.E. CS - 22MA201
		{HallNo: "MH 302", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS135", "7376251CS149")
		}()},

		// S.No 93 - MH 302 - B.Tech. IT - 22MA201
		{HallNo: "MH 302", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT139", "7376252IT148")
		}()},

		// S.No 94 - MH 303 - B.E. CS - 22MA201
		{HallNo: "MH 303", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS150", "7376251CS164")
		}()},

		// S.No 95 - MH 303 - B.Tech. IT - 22MA201
		{HallNo: "MH 303", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT149", "7376252IT158")
		}()},

		// S.No 96 - MH 305 - B.E. CS - 22MA201
		{HallNo: "MH 305", CourseCode: "22MA201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS165", "7376251CS168")...)
			r = append(r, expandRange("7376251CS170", "7376251CS180")...)
			return r
		}()},

		// S.No 97 - MH 305 - B.Tech. IT - 22MA201
		{HallNo: "MH 305", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT159", "7376252IT168")
		}()},

		// S.No 98 - MH 306 - B.E. CS - 22MA201
		{HallNo: "MH 306", CourseCode: "22MA201", RegisterNos: []string{
			"7376231CS121", "7376231CS139",
			"7376231CS145", "7376231CS173",
			"7376231CS190", "7376231CS206",
			"7376231CS207", "7376231CS230",
			"7376231CS235", "7376231CS240",
			"7376231CS244", "7376231CS249",
			"7376231CS251", "7376231CS259",
			"7376231CS269",
		}},

		// S.No 99 - MH 306 - B.Tech. IT - 22MA201
		{HallNo: "MH 306", CourseCode: "22MA201", RegisterNos: []string{
			"7376232IT113", "7376232IT139",
			"7376232IT146", "7376232IT152",
			"7376232IT177", "7376232IT192",
			"7376232IT211", "7376232IT224",
			"7376232IT250", "7376232IT274",
		}},

		// S.No 100 - SF B01 - B.E. BM - 22MA201
		{HallNo: "SF B01", CourseCode: "22MA201", RegisterNos: []string{"7376231BM102"}},

		// S.No 101 - SF B01 - B.E. SE - 22MA201
		{HallNo: "SF B01", CourseCode: "22MA201", RegisterNos: []string{
			"7376231SE103", "7376231SE122",
			"7376231SE128", "7376231SE137",
			"7376231SE139", "7376231SE144",
			"7376231SE153",
		}},

		// S.No 102 - SF B01 - M.E. CS - 24CS54
		{HallNo: "SF B01", CourseCode: "24CS54", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376254CS101", "7376254CS104")...)
			r = append(r, expandRange("7376254CS106", "7376254CS109")...)
			r = append(r, "7376254CS111")
			return r
		}()},

		// S.No 103 - SF B01 - M.B.A. - 24MB205
		{HallNo: "SF B01", CourseCode: "24MB205", RegisterNos: func() []string {
			return expandRange("7376257MB145", "7376257MB147")
		}()},

		// S.No 104 - SF B01 - B.E. EI - 22MA201
		{HallNo: "SF B01", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EI135", "7376251EI154")
		}()},

		// S.No 105 - SF B02 - B.E. BM - 22MA201
		{HallNo: "SF B02", CourseCode: "22MA201", RegisterNos: []string{
			"7376231BM107", "7376231BM132",
			"7376231BM134", "7376231BM148",
		}},

		// S.No 106 - SF B02 - B.Tech. FT - 22MA201
		{HallNo: "SF B02", CourseCode: "22MA201", RegisterNos: []string{
			"7376232FT101", "7376232FT105",
			"7376232FT110", "7376232FT120",
		}},

		// S.No 107 - SF B02 - B.Tech. CT - 22MA201
		{HallNo: "SF B02", CourseCode: "22MA201", RegisterNos: []string{
			"7376232CT102", "7376232CT107",
			"7376232CT117", "7376232CT122",
			"7376232CT127",
		}},

		// S.No 108 - SF B02 - B.Tech. AG - 22MA201
		{HallNo: "SF B02", CourseCode: "22MA201", RegisterNos: []string{
			"7376232AG113", "7376232AG129", "7376232AG151",
		}},

		// S.No 109 - SF B02 - B.Tech. AG - 22MA201
		{HallNo: "SF B02", CourseCode: "22MA201", RegisterNos: []string{
			"7376242AG119", "7376242AG122",
		}},

		// S.No 110 - SF B02 - B.E. EI - 22MA201
		{HallNo: "SF B02", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EI155", "7376251EI162")
		}()},

		// S.No 111 - SF B02 - B.Tech. AG - 22MA201
		{HallNo: "SF B02", CourseCode: "22MA201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252AG101", "7376252AG113")...)
			r = append(r, "7376252AG115")
			return r
		}()},

		// S.No 112 - SF B03 - B.E. CE - 22MA201
		{HallNo: "SF B03", CourseCode: "22MA201", RegisterNos: []string{
			"7376231CE104", "7376231CE108",
			"7376231CE117", "7376231CE120",
			"7376231CE122", "7376231CE126",
		}},

		// S.No 113 - SF B03 - B.E. CD - 22MA201
		{HallNo: "SF B03", CourseCode: "22MA201", RegisterNos: []string{
			"7376231CD107", "7376231CD111",
			"7376231CD115", "7376231CD139",
			"7376231CD143",
		}},

		// S.No 114 - SF B03 - B.Tech. FD - 22MA201
		{HallNo: "SF B03", CourseCode: "22MA201", RegisterNos: []string{
			"7376232FD109", "7376232FD112",
			"7376232FD118", "7376232FD137",
		}},

		// S.No 115 - SF B03 - Ph.D. IC - 24CS54
		{HallNo: "SF B03", CourseCode: "24CS54", RegisterNos: []string{"26234691327"}},

		// S.No 116 - SF B03 - M.E. IS - 24IS55
		{HallNo: "SF B03", CourseCode: "24IS55", RegisterNos: func() []string {
			return expandRange("7376254IS101", "7376254IS108")
		}()},

		// S.No 117 - SF B03 - B.Tech. AG - 22MA201
		{HallNo: "SF B03", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AG116", "7376252AG127")
		}()},

		// S.No 118 - WW 003 - B.E. EC - 22MA201
		{HallNo: "WW 003", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC104", "7376251EC113")
		}()},

		// S.No 119 - WW 003 - B.Tech. AD - 22MA201
		{HallNo: "WW 003", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD171", "7376252AD180")
		}()},

		// S.No 120 - WW 004 - B.E. EC - 22MA201
		{HallNo: "WW 004", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC149", "7376251EC158")
		}()},

		// S.No 121 - WW 004 - B.Tech. AD - 22MA201
		{HallNo: "WW 004", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD216", "7376252AD225")
		}()},

		// S.No 122 - WW 005 - B.E. EC - 22MA201
		{HallNo: "WW 005", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC159", "7376251EC168")
		}()},

		// S.No 123 - WW 005 - B.Tech. AD - 22MA201
		{HallNo: "WW 005", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD226", "7376252AD240")
		}()},

		// S.No 124 - WW 006 - B.E. EC - 22MA201
		{HallNo: "WW 006", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC189", "7376251EC198")
		}()},

		// S.No 125 - WW 006 - B.Tech. AD - 22MA201
		{HallNo: "WW 006", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD271", "7376252AD285")
		}()},

		// S.No 126 - WW 007 - B.E. EC - 22MA201
		{HallNo: "WW 007", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC199", "7376251EC208")
		}()},

		// S.No 127 - WW 007 - B.Tech. AD - 22MA201
		{HallNo: "WW 007", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD286", "7376252AD300")
		}()},

		// S.No 128 - WW 008 - B.E. EC - 22MA201
		{HallNo: "WW 008", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC219", "7376251EC228")
		}()},

		// S.No 129 - WW 008 - B.Tech. AD - 22MA201
		{HallNo: "WW 008", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD311", "7376252AD325")
		}()},

		// S.No 130 - WW 011 - B.E. EC - 22MA201
		{HallNo: "WW 011", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC294", "7376251EC303")
		}()},

		// S.No 131 - WW 011 - B.Tech. AL - 22MA201
		{HallNo: "WW 011", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AL106", "7376252AL120")
		}()},

		// S.No 132 - WW 012 - B.E. EC - 22MA201
		{HallNo: "WW 012", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC314", "7376251EC323")
		}()},

		// S.No 133 - WW 012 - B.Tech. AL - 22MA201
		{HallNo: "WW 012", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AL136", "7376252AL150")
		}()},

		// S.No 134 - WW 113 - B.E. CS - 22MA201
		{HallNo: "WW 113", CourseCode: "22MA201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS226", "7376251CS228")...)
			r = append(r, expandRange("7376251CS230", "7376251CS241")...)
			return r
		}()},

		// S.No 135 - WW 113 - B.Tech. IT - 22MA201
		{HallNo: "WW 113", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT199", "7376252IT208")
		}()},

		// S.No 136 - WW 114 - B.E. CS - 22MA201
		{HallNo: "WW 114", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS257", "7376251CS271")
		}()},

		// S.No 137 - WW 114 - B.Tech. IT - 22MA201
		{HallNo: "WW 114", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT219", "7376252IT228")
		}()},

		// S.No 138 - WW 115 - B.E. CS - 22MA201
		{HallNo: "WW 115", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS302", "7376251CS316")
		}()},

		// S.No 139 - WW 115 - B.Tech. IT - 22MA201
		{HallNo: "WW 115", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT249", "7376252IT258")
		}()},

		// S.No 140 - WW 117 - B.E. CS - 22MA201
		{HallNo: "WW 117", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS332", "7376251CS346")
		}()},

		// S.No 141 - WW 117 - B.Tech. IT - 22MA201
		{HallNo: "WW 117", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT269", "7376252IT278")
		}()},

		// S.No 142 - WW 118 - B.E. CS - 22MA201
		{HallNo: "WW 118", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS407", "7376251CS421")
		}()},

		// S.No 143 - WW 118 - B.Tech. IT - 22MA201
		{HallNo: "WW 118", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT319", "7376252IT328")
		}()},

		// S.No 144 - WW 211 - B.E. CS - 22MA201
		{HallNo: "WW 211", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251CS422", "7376251CS436")
		}()},

		// S.No 145 - WW 211 - B.Tech. IT - 22MA201
		{HallNo: "WW 211", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252IT329", "7376252IT338")
		}()},

		// S.No 146 - WW 212 - M.B.A. - 24MB205
		{HallNo: "WW 212", CourseCode: "24MB205", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376257MB119", "7376257MB123")...)
			r = append(r, expandRange("7376257MB125", "7376257MB144")...)
			return r
		}()},

		// S.No 147 - WW 212 - B.E. EI - 22MA201
		{HallNo: "WW 212", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EI110", "7376251EI134")
		}()},

		// S.No 148 - WW 213 - B.E. EC - 22MA201
		{HallNo: "WW 213", CourseCode: "22MA201", RegisterNos: []string{
			"7376231EC331", "7376231EC334",
		}},

		// S.No 149 - WW 213 - B.E. EC - 22MA201
		{HallNo: "WW 213", CourseCode: "22MA201", RegisterNos: []string{
			"7376241EC111", "7376241EC124",
			"7376241EC133", "7376241EC137",
			"7376241EC138", "7376241EC139",
			"7376241EC140", "7376241EC144",
		}},

		// S.No 150 - WW 213 - B.Tech. AD - 22MA201
		{HallNo: "WW 213", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD116", "7376252AD130")
		}()},

		// S.No 151 - WW 214 - B.E. EC - 22MA201
		{HallNo: "WW 214", CourseCode: "22MA201", RegisterNos: []string{
			"7376241EC223", "7376241EC239",
			"7376241EC241", "7376241EC243",
			"7376241EC246", "7376241EC256",
			"7376241EC271", "7376241EC282",
			"7376241EC284", "7376241EC293",
		}},

		// S.No 152 - WW 214 - B.Tech. AD - 22MA201
		{HallNo: "WW 214", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD141", "7376252AD155")
		}()},

		// S.No 153 - WW 215 - B.E. EC - 22MA201
		{HallNo: "WW 215", CourseCode: "22MA201", RegisterNos: []string{
			"7376241EC300", "7376241EC302",
			"7376241EC312", "7376241EC321",
			"7376241EC328", "7376241EC333",
			"7376241EC334",
		}},

		// S.No 154 - WW 215 - B.E. EC - 22MA201
		{HallNo: "WW 215", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EC101", "7376251EC103")
		}()},

		// S.No 155 - WW 215 - B.Tech. AD - 22MA201
		{HallNo: "WW 215", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252AD156", "7376252AD170")
		}()},

		// S.No 156 - WW 218 - B.E. EE - 22MA201
		{HallNo: "WW 218", CourseCode: "22MA201", RegisterNos: []string{
			"7376241EE145", "7376241EE146",
			"7376241EE147", "7376241EE157",
			"7376241EE160", "7376241EE188",
			"7376241EE193", "7376241EE198",
			"7376241EE208", "7376241EE211",
			"7376241EE215",
		}},

		// S.No 157 - WW 218 - B.E. EE - 22MA201
		{HallNo: "WW 218", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EE102", "7376251EE105")
		}()},

		// S.No 158 - WW 218 - B.Tech. BT - 22MA201
		{HallNo: "WW 218", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252BT134", "7376252BT143")
		}()},

		// S.No 159 - WW 219 - B.E. EE - 22MA201
		{HallNo: "WW 219", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EE106", "7376251EE120")
		}()},

		// S.No 160 - WW 219 - B.Tech. BT - 22MA201
		{HallNo: "WW 219", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252BT144", "7376252BT153")
		}()},

		// S.No 161 - WW 220 - B.E. EE - 22MA201
		{HallNo: "WW 220", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EE121", "7376251EE130")
		}()},

		// S.No 162 - WW 220 - B.Tech. BT - 22MA201
		{HallNo: "WW 220", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252BT154", "7376252BT163")
		}()},

		// S.No 163 - WW 221 - B.E. EE - 22MA201
		{HallNo: "WW 221", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EE131", "7376251EE140")
		}()},

		// S.No 164 - WW 221 - B.Tech. BT - 22MA201
		{HallNo: "WW 221", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252BT164", "7376252BT173")
		}()},

		// S.No 165 - WW 222 - B.E. EE - 22MA201
		{HallNo: "WW 222", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EE141", "7376251EE165")
		}()},

		// S.No 166 - WW 222 - B.Tech. BT - 22MA201
		{HallNo: "WW 222", CourseCode: "22MA201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252BT174", "7376252BT189")...)
			r = append(r, expandRange("7376252BT191", "7376252BT197")...)
			r = append(r, "7376252BT199")
			return r
		}()},

		// S.No 167 - WW 223 - B.E. EE - 22MA201
		{HallNo: "WW 223", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EE166", "7376251EE190")
		}()},

		// S.No 168 - WW 223 - B.Tech. BT - 22MA201
		{HallNo: "WW 223", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376252BT200", "7376252BT224")
		}()},

		// S.No 169 - WW 224 - B.E. ME - 22MA201
		{HallNo: "WW 224", CourseCode: "22MA201", RegisterNos: []string{
			"7376231ME103", "7376231ME104",
			"7376231ME110", "7376231ME113",
			"7376231ME124", "7376231ME127",
			"7376231ME130", "7376231ME134",
			"7376231ME135",
		}},

		// S.No 170 - WW 224 - B.E. MZ - 22MA201
		{HallNo: "WW 224", CourseCode: "22MA201", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107",
			"7376231MZ108", "7376231MZ111",
			"7376231MZ113", "7376231MZ115",
			"7376231MZ119", "7376231MZ135",
			"7376231MZ136", "7376231MZ148",
			"7376231MZ154",
		}},

		// S.No 171 - WW 224 - B.E. MZ - 22MA201
		{HallNo: "WW 224", CourseCode: "22MA201", RegisterNos: []string{
			"7376241MZ108", "7376241MZ112",
			"7376241MZ113", "7376241MZ120",
			"7376241MZ121", "7376241MZ124",
			"7376241MZ127", "7376241MZ131",
			"7376241MZ137", "7376241MZ139",
			"7376241MZ143", "7376241MZ157",
		}},

		// S.No 172 - WW 224 - B.E. EE - 22MA201
		{HallNo: "WW 224", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251EE191", "7376251EE205")
		}()},

		// S.No 173 - WW 224 - B.E. MZ - 22MA201
		{HallNo: "WW 224", CourseCode: "22MA201", RegisterNos: []string{
			"7376251MZ101", "7376251MZ102",
		}},

		// S.No 174 - WW 225 - B.E. ME - 22MA201
		{HallNo: "WW 225", CourseCode: "22MA201", RegisterNos: []string{
			"7376231ME136", "7376231ME143", "7376231ME149",
		}},

		// S.No 175 - WW 225 - B.E. ME - 22MA201
		{HallNo: "WW 225", CourseCode: "22MA201", RegisterNos: []string{
			"7376241ME104", "7376241ME112",
			"7376241ME116", "7376241ME123",
			"7376241ME124", "7376241ME127",
			"7376241ME128", "7376241ME146",
			"7376241ME154", "7376241ME155",
		}},

		// S.No 176 - WW 225 - B.E. ME - 22MA201
		{HallNo: "WW 225", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251ME102", "7376251ME113")
		}()},

		// S.No 177 - WW 225 - B.E. MZ - 22MA201
		{HallNo: "WW 225", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251MZ103", "7376251MZ127")
		}()},

		// S.No 178 - WW 226 - B.E. ME - 22MA201
		{HallNo: "WW 226", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251ME114", "7376251ME138")
		}()},

		// S.No 179 - WW 226 - B.E. MZ - 22MA201
		{HallNo: "WW 226", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251MZ128", "7376251MZ152")
		}()},

		// S.No 180 - WW 227 - B.E. EI - 22MA201
		{HallNo: "WW 227", CourseCode: "22MA201", RegisterNos: []string{
			"7376231EI124", "7376231EI128",
			"7376231EI133", "7376231EI143",
			"7376231EI144", "7376231EI151",
			"7376231EI156", "7376231EI159",
		}},

		// S.No 181 - WW 227 - M.B.A. - 24MB205
		{HallNo: "WW 227", CourseCode: "24MB205", RegisterNos: []string{"7376247MB112"}},

		// S.No 182 - WW 227 - B.E. EI - 22MA201
		{HallNo: "WW 227", CourseCode: "22MA201", RegisterNos: []string{
			"7376241EI101", "7376241EI106",
			"7376241EI107", "7376241EI111",
			"7376241EI119", "7376241EI123",
			"7376241EI133",
		}},

		// S.No 183 - WW 227 - M.B.A. - 24MB205
		{HallNo: "WW 227", CourseCode: "24MB205", RegisterNos: []string{
			"7376257MB101", "7376257MB102",
		}},

		// S.No 184 - WW 227 - B.E. ME - 22MA201
		{HallNo: "WW 227", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251ME139", "7376251ME160")
		}()},

		// S.No 185 - WW 227 - B.E. MZ - 22MA201
		{HallNo: "WW 227", CourseCode: "22MA201", RegisterNos: func() []string {
			return expandRange("7376251MZ153", "7376251MZ162")
		}()},
	}
}

// buildSeatingData22June2026AN returns seating records for 22-06-2026 AN session (01:30 PM to 04:30 PM)
func buildSeatingData22June2026AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. CS - 22PH102
		{HallNo: "EW 101", CourseCode: "22PH102", RegisterNos: []string{
			"7376231CS102", "7376231CS259", "7376231CS346",
		}},

		// S.No 2 - EW 101 - B.Tech. AD - 22PH102
		{HallNo: "EW 101", CourseCode: "22PH102", RegisterNos: []string{"7376232AD265"}},

		// S.No 3 - EW 101 - B.E. CS - 22PH102
		{HallNo: "EW 101", CourseCode: "22PH102", RegisterNos: []string{
			"7376241CS118", "7376241CS141",
			"7376241CS143", "7376241CS151",
			"7376241CS185", "7376241CS257",
			"7376241CS288",
		}},

		// S.No 4 - EW 101 - B.Tech. AD - 22PH102
		{HallNo: "EW 101", CourseCode: "22PH102", RegisterNos: []string{
			"7376242AD137", "7376242AD153",
			"7376242AD183", "7376242AD189",
			"7376242AD202", "7376242AD218",
			"7376242AD242", "7376242AD291",
			"7376242AD308", "7376242AD311",
			"7376242AD320",
		}},

		// S.No 5 - EW 101 - B.Tech. AD - 22PH102
		{HallNo: "EW 101", CourseCode: "22PH102", RegisterNos: []string{
			"7376252AD104", "7376252AD126", "7376252AD128",
		}},

		// S.No 6 - EW 102 - B.E. CS - 22PH102
		{HallNo: "EW 102", CourseCode: "22PH102", RegisterNos: []string{
			"7376241CS307", "7376241CS335",
			"7376241CS395", "7376241CS455",
			"7376241CS473", "7376241CS474",
		}},

		// S.No 7 - EW 102 - B.E. CS - 22PH102
		{HallNo: "EW 102", CourseCode: "22PH102", RegisterNos: []string{
			"7376251CS129", "7376251CS163",
			"7376251CS166", "7376251CS168",
		}},

		// S.No 8 - EW 102 - B.Tech. AD - 22PH102
		{HallNo: "EW 102", CourseCode: "22PH102", RegisterNos: []string{
			"7376252AD129", "7376252AD137",
			"7376252AD141", "7376252AD147",
			"7376252AD155", "7376252AD177",
			"7376252AD187", "7376252AD192",
			"7376252AD193", "7376252AD200",
			"7376252AD201", "7376252AD214",
			"7376252AD218", "7376252AD222",
			"7376252AD254",
		}},

		// S.No 9 - EW 103 - B.Tech. IT - 22PH102
		{HallNo: "EW 103", CourseCode: "22PH102", RegisterNos: []string{
			"7376232IT211", "7376232IT282",
		}},

		// S.No 10 - EW 103 - B.Tech. IT - 22PH102
		{HallNo: "EW 103", CourseCode: "22PH102", RegisterNos: []string{
			"7376242IT108", "7376242IT110",
			"7376242IT113", "7376242IT129",
			"7376242IT164", "7376242IT166",
			"7376242IT184", "7376242IT188",
		}},

		// S.No 11 - EW 103 - B.E. CS - 22PH102
		{HallNo: "EW 103", CourseCode: "22PH102", RegisterNos: []string{
			"7376251CS193", "7376251CS200",
			"7376251CS223", "7376251CS229",
			"7376251CS245", "7376251CS268",
			"7376251CS315", "7376251CS336",
			"7376251CS352", "7376251CS385",
		}},

		// S.No 12 - EW 103 - B.Tech. AD - 22PH102
		{HallNo: "EW 103", CourseCode: "22PH102", RegisterNos: []string{
			"7376252AD257", "7376252AD291",
			"7376252AD331", "7376252AD369",
			"7376252AD376",
		}},

		// S.No 13 - EW 104 - B.Tech. AL - 22PH102
		{HallNo: "EW 104", CourseCode: "22PH102", RegisterNos: []string{"7376232AL157"}},

		// S.No 14 - EW 104 - B.Tech. IT - 22PH102
		{HallNo: "EW 104", CourseCode: "22PH102", RegisterNos: []string{
			"7376242IT214", "7376242IT227",
			"7376242IT250", "7376242IT257",
			"7376242IT300", "7376242IT318",
		}},

		// S.No 15 - EW 104 - B.Tech. AL - 22PH102
		{HallNo: "EW 104", CourseCode: "22PH102", RegisterNos: []string{
			"7376242AL104", "7376242AL114",
			"7376242AL116", "7376242AL128",
			"7376242AL144",
		}},

		// S.No 16 - EW 104 - B.E. CS - 22PH102
		{HallNo: "EW 104", CourseCode: "22PH102", RegisterNos: []string{
			"7376251CS387", "7376251CS429",
			"7376251CS467", "7376251CS479",
		}},

		// S.No 17 - EW 104 - B.Tech. IT - 22PH102
		{HallNo: "EW 104", CourseCode: "22PH102", RegisterNos: []string{
			"7376252IT122", "7376252IT166",
			"7376252IT191", "7376252IT213",
			"7376252IT240", "7376252IT250",
			"7376252IT253", "7376252IT256",
		}},

		// S.No 18 - EW 105 - B.E. EC - 22PH102
		{HallNo: "EW 105", CourseCode: "22PH102", RegisterNos: []string{
			"7376231EC283", "7376231EC334",
		}},

		// S.No 19 - EW 105 - B.E. EE - 22PH102
		{HallNo: "EW 105", CourseCode: "22PH102", RegisterNos: []string{"7376231EE111"}},

		// S.No 20 - EW 105 - B.E. EC - 22PH102
		{HallNo: "EW 105", CourseCode: "22PH102", RegisterNos: []string{
			"7376241EC139", "7376241EC147",
			"7376241EC184", "7376241EC241",
			"7376241EC273",
		}},

		// S.No 21 - EW 105 - B.E. EE - 22PH102
		{HallNo: "EW 105", CourseCode: "22PH102", RegisterNos: []string{"7376241EE132"}},

		// S.No 22 - EW 105 - B.Tech. AL - 22PH102
		{HallNo: "EW 105", CourseCode: "22PH102", RegisterNos: []string{
			"7376242AL156", "7376242AL169",
			"7376242AL193", "7376242AL197",
			"7376242AL207", "7376242AL217",
		}},

		// S.No 23 - EW 105 - B.Tech. IT - 22PH102
		{HallNo: "EW 105", CourseCode: "22PH102", RegisterNos: []string{
			"7376252IT264", "7376252IT269",
			"7376252IT291", "7376252IT297",
			"7376252IT331", "7376252IT371",
			"7376252IT376", "7376252IT387",
		}},

		// S.No 24 - EW 105 - B.Tech. AL - 22PH102
		{HallNo: "EW 105", CourseCode: "22PH102", RegisterNos: []string{
			"7376252AL103", "7376252AL208",
		}},

		// S.No 25 - EW 106 - B.E. EI - 22PH102
		{HallNo: "EW 106", CourseCode: "22PH102", RegisterNos: []string{
			"7376231EI128", "7376231EI143",
		}},

		// S.No 26 - EW 106 - B.E. EC - 22PH102
		{HallNo: "EW 106", CourseCode: "22PH102", RegisterNos: []string{
			"7376241EC312", "7376241EC321",
		}},

		// S.No 27 - EW 106 - B.E. EE - 22PH102
		{HallNo: "EW 106", CourseCode: "22PH102", RegisterNos: []string{
			"7376241EE145", "7376241EE147",
		}},

		// S.No 28 - EW 106 - B.E. EI - 22PH102
		{HallNo: "EW 106", CourseCode: "22PH102", RegisterNos: []string{"7376241EI146"}},

		// S.No 29 - EW 106 - B.E. EC - 22PH102
		{HallNo: "EW 106", CourseCode: "22PH102", RegisterNos: []string{
			"7376251EC105", "7376251EC186",
			"7376251EC296", "7376251EC347",
		}},

		// S.No 30 - EW 106 - B.E. EE - 22PH102
		{HallNo: "EW 106", CourseCode: "22PH102", RegisterNos: []string{
			"7376251EE102", "7376251EE112",
			"7376251EE114", "7376251EE138",
			"7376251EE142", "7376251EE144",
			"7376251EE152", "7376251EE181",
		}},

		// S.No 31 - EW 106 - B.E. EI - 22PH102
		{HallNo: "EW 106", CourseCode: "22PH102", RegisterNos: []string{
			"7376251EI102", "7376251EI126",
			"7376251EI128", "7376251EI134",
			"7376251EI144", "7376251EI145",
		}},

		// S.No 32 - EW 201 - B.E. MZ - 22PH102
		{HallNo: "EW 201", CourseCode: "22PH102", RegisterNos: []string{
			"7376231MZ106", "7376231MZ111", "7376231MZ135",
		}},

		// S.No 33 - EW 201 - B.Tech. CB - 22CB102
		{HallNo: "EW 201", CourseCode: "22CB102", RegisterNos: []string{"7376232CB106"}},

		// S.No 34 - EW 201 - B.E. MZ - 22PH102
		{HallNo: "EW 201", CourseCode: "22PH102", RegisterNos: []string{
			"7376241MZ124", "7376241MZ139", "7376241MZ143",
		}},

		// S.No 35 - EW 201 - B.Tech. BT - 22PH102
		{HallNo: "EW 201", CourseCode: "22PH102", RegisterNos: []string{
			"7376242BT156", "7376242BT172", "7376242BT182",
		}},

		// S.No 36 - EW 201 - B.Tech. CB - 22CB102
		{HallNo: "EW 201", CourseCode: "22CB102", RegisterNos: []string{
			"7376242CB116", "7376242CB118", "7376242CB119",
		}},

		// S.No 37 - EW 201 - B.E. EI - 22PH102
		{HallNo: "EW 201", CourseCode: "22PH102", RegisterNos: []string{
			"7376251EI153", "7376251EI161", "7376251EI162",
		}},

		// S.No 38 - EW 201 - B.E. MZ - 22PH102
		{HallNo: "EW 201", CourseCode: "22PH102", RegisterNos: []string{
			"7376251MZ104", "7376251MZ105", "7376251MZ124",
		}},

		// S.No 39 - EW 201 - B.Tech. BT - 22PH102
		{HallNo: "EW 201", CourseCode: "22PH102", RegisterNos: []string{
			"7376252BT120", "7376252BT143",
			"7376252BT181", "7376252BT187",
			"7376252BT198",
		}},

		// S.No 40 - EW 202 - B.E. CE - 22PH102
		{HallNo: "EW 202", CourseCode: "22PH102", RegisterNos: []string{"7376231CE120"}},

		// S.No 41 - EW 202 - B.E. BM - 22PH102
		{HallNo: "EW 202", CourseCode: "22PH102", RegisterNos: []string{"7376231BM107"}},

		// S.No 42 - EW 202 - B.E. SE - 22PH102
		{HallNo: "EW 202", CourseCode: "22PH102", RegisterNos: []string{"7376231SE144"}},

		// S.No 43 - EW 202 - B.Tech. AG - 22PH102
		{HallNo: "EW 202", CourseCode: "22PH102", RegisterNos: []string{"7376232AG113"}},

		// S.No 44 - EW 202 - B.Tech. CB - 22CB102
		{HallNo: "EW 202", CourseCode: "22CB102", RegisterNos: []string{"7376242CB154"}},

		// S.No 45 - EW 202 - M.B.A. - 24MB105
		{HallNo: "EW 202", CourseCode: "24MB105", RegisterNos: []string{
			"7376257MB101", "7376257MB126",
		}},

		// S.No 46 - EW 202 - B.E. ME - 22PH102
		{HallNo: "EW 202", CourseCode: "22PH102", RegisterNos: []string{
			"7376251ME107", "7376251ME119",
			"7376251ME140", "7376251ME153",
			"7376251ME154", "7376251ME160",
		}},

		// S.No 47 - EW 202 - B.Tech. AG - 22PH102
		{HallNo: "EW 202", CourseCode: "22PH102", RegisterNos: []string{
			"7376252AG114", "7376252AG117",
			"7376252AG119", "7376252AG123",
		}},
	}
}

// buildSeatingData24June2026FN returns seating records for 24-06-2026 FN session (09:00 AM to 12:00 PM)
func buildSeatingData24June2026FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 301 - M.B.A. - 24MB206
		{HallNo: "AE 301", CourseCode: "24MB206", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376257MB101", "7376257MB102")
			r = append(r, expandRange("7376257MB104", "7376257MB109")...)
			return r
		}()},

		// S.No 2 - AE 301 - B.E. EI - 22PH202
		{HallNo: "AE 301", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EI156", "7376251EI162")
		}()},

		// S.No 3 - AE 301 - B.E. ME - 22PH202
		{HallNo: "AE 301", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251ME138", "7376251ME147")
		}()},

		// S.No 4 - AE 302 - B.E. CS - 22PH202
		{HallNo: "AE 302", CourseCode: "22PH202", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS225", "7376251CS228")...)
			r = append(r, expandRange("7376251CS230", "7376251CS240")...)
			return r
		}()},

		// S.No 5 - AE 302 - B.Tech. IT - 22PH202
		{HallNo: "AE 302", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT193", "7376252IT202")
		}()},

		// S.No 6 - EW 101 - B.E. CS - 22PH202
		{HallNo: "EW 101", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS241", "7376251CS255")
		}()},

		// S.No 7 - EW 101 - B.Tech. IT - 22PH202
		{HallNo: "EW 101", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT203", "7376252IT212")
		}()},

		// S.No 8 - EW 102 - B.E. CS - 22PH202
		{HallNo: "EW 102", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS256", "7376251CS270")
		}()},

		// S.No 9 - EW 102 - B.Tech. IT - 22PH202
		{HallNo: "EW 102", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT213", "7376252IT222")
		}()},

		// S.No 10 - EW 103 - B.E. CS - 22PH202
		{HallNo: "EW 103", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS286", "7376251CS300")
		}()},

		// S.No 11 - EW 103 - B.Tech. IT - 22PH202
		{HallNo: "EW 103", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT233", "7376252IT242")
		}()},

		// S.No 12 - EW 104 - B.E. CS - 22PH202
		{HallNo: "EW 104", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS346", "7376251CS360")
		}()},

		// S.No 13 - EW 104 - B.Tech. IT - 22PH202
		{HallNo: "EW 104", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT273", "7376252IT282")
		}()},

		// S.No 14 - EW 105 - B.E. CS - 22PH202
		{HallNo: "EW 105", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS361", "7376251CS375")
		}()},

		// S.No 15 - EW 105 - B.Tech. IT - 22PH202
		{HallNo: "EW 105", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT283", "7376252IT292")
		}()},

		// S.No 16 - EW 106 - B.E. CS - 22PH202
		{HallNo: "EW 106", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS406", "7376251CS420")
		}()},

		// S.No 17 - EW 106 - B.Tech. IT - 22PH202
		{HallNo: "EW 106", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT313", "7376252IT322")
		}()},

		// S.No 18 - EW 107 - B.E. CS - 22PH202
		{HallNo: "EW 107", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS271", "7376251CS285")
		}()},

		// S.No 19 - EW 107 - B.Tech. IT - 22PH202
		{HallNo: "EW 107", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT223", "7376252IT232")
		}()},

		// S.No 20 - EW 108 - B.E. CS - 22PH202
		{HallNo: "EW 108", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS301", "7376251CS315")
		}()},

		// S.No 21 - EW 108 - B.Tech. IT - 22PH202
		{HallNo: "EW 108", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT243", "7376252IT252")
		}()},

		// S.No 22 - EW 109 - B.E. CS - 22PH202
		{HallNo: "EW 109", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS316", "7376251CS330")
		}()},

		// S.No 23 - EW 109 - B.Tech. IT - 22PH202
		{HallNo: "EW 109", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT253", "7376252IT262")
		}()},

		// S.No 24 - EW 111 - B.E. CS - 22PH202
		{HallNo: "EW 111", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS331", "7376251CS345")
		}()},

		// S.No 25 - EW 111 - B.Tech. IT - 22PH202
		{HallNo: "EW 111", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT263", "7376252IT272")
		}()},

		// S.No 26 - EW 112 - B.E. CS - 22PH202
		{HallNo: "EW 112", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS376", "7376251CS390")
		}()},

		// S.No 27 - EW 112 - B.Tech. IT - 22PH202
		{HallNo: "EW 112", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT293", "7376252IT302")
		}()},

		// S.No 28 - EW 113 - B.E. EC - 22PH202
		{HallNo: "EW 113", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC148", "7376251EC157")
		}()},

		// S.No 29 - EW 113 - B.Tech. AD - 22PH202
		{HallNo: "EW 113", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD180", "7376252AD194")
		}()},

		// S.No 30 - EW 114 - B.E. EC - 22PH202
		{HallNo: "EW 114", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC198", "7376251EC207")
		}()},

		// S.No 31 - EW 114 - B.Tech. AD - 22PH202
		{HallNo: "EW 114", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD255", "7376252AD269")
		}()},

		// S.No 32 - EW 115 - B.E. EC - 22PH202
		{HallNo: "EW 115", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC233", "7376251EC242")
		}()},

		// S.No 33 - EW 115 - B.Tech. AD - 22PH202
		{HallNo: "EW 115", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD295", "7376252AD309")
		}()},

		// S.No 34 - EW 116 - B.E. EC - 22PH202
		{HallNo: "EW 116", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC243", "7376251EC252")
		}()},

		// S.No 35 - EW 116 - B.Tech. AD - 22PH202
		{HallNo: "EW 116", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD310", "7376252AD324")
		}()},

		// S.No 36 - EW 117 - B.E. EC - 22PH202
		{HallNo: "EW 117", CourseCode: "22PH202", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EC263", "7376251EC269")...)
			r = append(r, expandRange("7376251EC271", "7376251EC273")...)
			return r
		}()},

		// S.No 37 - EW 117 - B.Tech. AD - 22PH202
		{HallNo: "EW 117", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD340", "7376252AD354")
		}()},

		// S.No 38 - EW 118 - B.Tech. AL - 22PH202
		{HallNo: "EW 118", CourseCode: "22PH202", RegisterNos: []string{
			"7376242AL157", "7376242AL190", "7376242AL197",
		}},

		// S.No 39 - EW 118 - B.E. EC - 22PH202
		{HallNo: "EW 118", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC284", "7376251EC293")
		}()},

		// S.No 40 - EW 118 - B.Tech. AD - 22PH202
		{HallNo: "EW 118", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD370", "7376252AD381")
		}()},

		// S.No 41 - EW 201 - B.E. CS - 22PH202
		{HallNo: "EW 201", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS436", "7376251CS450")
		}()},

		// S.No 42 - EW 201 - B.Tech. IT - 22PH202
		{HallNo: "EW 201", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT333", "7376252IT342")
		}()},

		// S.No 43 - EW 202 - B.Tech. AD - 22PH202
		{HallNo: "EW 202", CourseCode: "22PH202", RegisterNos: []string{"7376232AD250"}},

		// S.No 44 - EW 202 - B.E. CS - 22PH202
		{HallNo: "EW 202", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS466", "7376251CS479")
		}()},

		// S.No 45 - EW 202 - B.Tech. IT - 22PH202
		{HallNo: "EW 202", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT353", "7376252IT362")
		}()},

		// S.No 46 - EW 203 - B.E. EC - 22PH202
		{HallNo: "EW 203", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC158", "7376251EC167")
		}()},

		// S.No 47 - EW 203 - B.Tech. AD - 22PH202
		{HallNo: "EW 203", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD195", "7376252AD209")
		}()},

		// S.No 48 - EW 206 - B.E. EC - 22PH202
		{HallNo: "EW 206", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC208", "7376251EC232")
		}()},

		// S.No 49 - EW 206 - B.Tech. AD - 22PH202
		{HallNo: "EW 206", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD270", "7376252AD294")
		}()},

		// S.No 50 - EW 207 - B.E. CS - 22PH202
		{HallNo: "EW 207", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS391", "7376251CS405")
		}()},

		// S.No 51 - EW 207 - B.Tech. IT - 22PH202
		{HallNo: "EW 207", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT303", "7376252IT312")
		}()},

		// S.No 52 - EW 208 - B.E. CS - 22PH202
		{HallNo: "EW 208", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS421", "7376251CS435")
		}()},

		// S.No 53 - EW 208 - B.Tech. IT - 22PH202
		{HallNo: "EW 208", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT323", "7376252IT332")
		}()},

		// S.No 54 - EW 209 - B.E. CS - 22PH202
		{HallNo: "EW 209", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS451", "7376251CS465")
		}()},

		// S.No 55 - EW 209 - B.Tech. IT - 22PH202
		{HallNo: "EW 209", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT343", "7376252IT352")
		}()},

		// S.No 56 - EW 210 - B.Tech. AD - 22PH202
		{HallNo: "EW 210", CourseCode: "22PH202", RegisterNos: []string{
			"7376242AD107", "7376242AD137",
			"7376242AD183", "7376242AD189",
			"7376242AD190", "7376242AD202",
			"7376242AD218", "7376242AD291",
			"7376242AD301", "7376242AD308",
		}},

		// S.No 57 - EW 210 - B.Tech. IT - 22PH202
		{HallNo: "EW 210", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT363", "7376252IT372")
		}()},

		// S.No 58 - EW 211 - B.E. EC - 22PH202
		{HallNo: "EW 211", CourseCode: "22PH202", RegisterNos: []string{
			"7376231EC331", "7376231EC334",
		}},

		// S.No 59 - EW 211 - B.E. EC - 22PH202
		{HallNo: "EW 211", CourseCode: "22PH202", RegisterNos: []string{
			"7376241EC111", "7376241EC137",
			"7376241EC170", "7376241EC171",
			"7376241EC241", "7376241EC256",
		}},

		// S.No 60 - EW 211 - B.E. EC - 22PH202
		{HallNo: "EW 211", CourseCode: "22PH202", RegisterNos: []string{
			"7376251EC101", "7376251EC102",
		}},

		// S.No 61 - EW 211 - B.Tech. AD - 22PH202
		{HallNo: "EW 211", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD120", "7376252AD129")
		}()},

		// S.No 62 - EW 212 - B.E. EC - 22PH202
		{HallNo: "EW 212", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC103", "7376251EC127")
		}()},

		// S.No 63 - EW 212 - B.Tech. AD - 22PH202
		{HallNo: "EW 212", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD130", "7376252AD154")
		}()},

		// S.No 64 - EW 213 - B.Tech. AL - 22PH202
		{HallNo: "EW 213", CourseCode: "22PH202", RegisterNos: []string{"7376242AL207"}},

		// S.No 65 - EW 213 - B.E. EC - 22PH202
		{HallNo: "EW 213", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC294", "7376251EC303")
		}()},

		// S.No 66 - EW 213 - B.Tech. AL - 22PH202
		{HallNo: "EW 213", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AL101", "7376252AL114")
		}()},

		// S.No 67 - EW 214 - B.E. EC - 22PH202
		{HallNo: "EW 214", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC304", "7376251EC313")
		}()},

		// S.No 68 - EW 214 - B.Tech. AL - 22PH202
		{HallNo: "EW 214", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AL115", "7376252AL129")
		}()},

		// S.No 69 - EW 215 - B.E. EC - 22PH202
		{HallNo: "EW 215", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC324", "7376251EC333")
		}()},

		// S.No 70 - EW 215 - B.Tech. AL - 22PH202
		{HallNo: "EW 215", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AL140", "7376252AL154")
		}()},

		// S.No 71 - EW 216 - B.Tech. BT - 22PH202
		{HallNo: "EW 216", CourseCode: "22PH202", RegisterNos: []string{"7376232BT142"}},

		// S.No 72 - EW 216 - B.E. EC - 22PH202
		{HallNo: "EW 216", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC344", "7376251EC352")
		}()},

		// S.No 73 - EW 216 - B.Tech. AL - 22PH202
		{HallNo: "EW 216", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AL165", "7376252AL174")
		}()},

		// S.No 74 - EW 217 - B.Tech. BT - 22PH202
		{HallNo: "EW 217", CourseCode: "22PH202", RegisterNos: []string{"7376242BT156"}},

		// S.No 75 - EW 217 - B.Tech. BT - 22PH202
		{HallNo: "EW 217", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252BT102", "7376252BT110")
		}()},

		// S.No 76 - EW 217 - B.Tech. AL - 22PH202
		{HallNo: "EW 217", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AL175", "7376252AL184")
		}()},

		// S.No 77 - EW 218 - B.Tech. BT - 22PH202
		{HallNo: "EW 218", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252BT111", "7376252BT135")
		}()},

		// S.No 78 - EW 218 - B.Tech. AL - 22PH202
		{HallNo: "EW 218", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AL185", "7376252AL209")
		}()},

		// S.No 79 - MECH DH - B.Tech. IT - 22PH202
		{HallNo: "MECH DH", CourseCode: "22PH202", RegisterNos: []string{
			"7376242IT188", "7376242IT201",
			"7376242IT214", "7376242IT250",
			"7376242IT257", "7376242IT260",
			"7376242IT287", "7376242IT292",
			"7376242IT300", "7376242IT318",
			"7376242IT319",
		}},

		// S.No 80 - MECH DH - B.E. CS - 22PH202
		{HallNo: "MECH DH", CourseCode: "22PH202", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS106", "7376251CS128")...)
			r = append(r, expandRange("7376251CS130", "7376251CS168")...)
			r = append(r, expandRange("7376251CS170", "7376251CS179")...)
			return r
		}()},

		// S.No 81 - MECH DH - B.Tech. IT - 22PH202
		{HallNo: "MECH DH", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT102", "7376252IT162")
		}()},

		// S.No 82 - MH 302 - B.E. CS - 22PH202
		{HallNo: "MH 302", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS180", "7376251CS194")
		}()},

		// S.No 83 - MH 302 - B.Tech. IT - 22PH202
		{HallNo: "MH 302", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT163", "7376252IT172")
		}()},

		// S.No 84 - MH 303 - B.E. CS - 22PH202
		{HallNo: "MH 303", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS195", "7376251CS209")
		}()},

		// S.No 85 - MH 303 - B.Tech. IT - 22PH202
		{HallNo: "MH 303", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT173", "7376252IT182")
		}()},

		// S.No 86 - MH 305 - B.E. CS - 22PH202
		{HallNo: "MH 305", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS210", "7376251CS224")
		}()},

		// S.No 87 - MH 305 - B.Tech. IT - 22PH202
		{HallNo: "MH 305", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT183", "7376252IT192")
		}()},

		// S.No 88 - MH 306 - B.E. CS - 22PH202
		{HallNo: "MH 306", CourseCode: "22PH202", RegisterNos: []string{
			"7376231CS103", "7376231CS139",
			"7376231CS207", "7376231CS244",
			"7376231CS259", "7376231CS288",
		}},

		// S.No 89 - MH 306 - B.Tech. IT - 22PH202
		{HallNo: "MH 306", CourseCode: "22PH202", RegisterNos: []string{
			"7376232IT123", "7376232IT211", "7376232IT282",
		}},

		// S.No 90 - MH 306 - B.E. CS - 22PH202
		{HallNo: "MH 306", CourseCode: "22PH202", RegisterNos: []string{
			"7376241CS230", "7376241CS257",
			"7376241CS318", "7376241CS395",
		}},

		// S.No 91 - MH 306 - B.Tech. IT - 22PH202
		{HallNo: "MH 306", CourseCode: "22PH202", RegisterNos: []string{
			"7376242IT108", "7376242IT110",
			"7376242IT124", "7376242IT129",
			"7376242IT141", "7376242IT146",
			"7376242IT184",
		}},

		// S.No 92 - MH 306 - B.E. CS - 22PH202
		{HallNo: "MH 306", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251CS101", "7376251CS105")
		}()},

		// S.No 93 - SF B01 - B.Tech. AG - 22PH202
		{HallNo: "SF B01", CourseCode: "22PH202", RegisterNos: []string{
			"7376232AG113", "7376232AG151",
		}},

		// S.No 94 - SF B01 - M.B.A. - 24MB206
		{HallNo: "SF B01", CourseCode: "24MB206", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376257MB110", "7376257MB123")...)
			r = append(r, expandRange("7376257MB125", "7376257MB130")...)
			return r
		}()},

		// S.No 95 - SF B01 - B.E. ME - 22PH202
		{HallNo: "SF B01", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251ME148", "7376251ME160")
		}()},

		// S.No 96 - SF B01 - B.Tech. AG - 22PH202
		{HallNo: "SF B01", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AG101", "7376252AG105")
		}()},

		// S.No 97 - SF B02 - M.E. CS - 24CS58
		{HallNo: "SF B02", CourseCode: "24CS58", RegisterNos: []string{
			"7376254CS101", "7376254CS103", "7376254CS104",
		}},

		// S.No 98 - SF B02 - M.B.A. - 24MB206
		{HallNo: "SF B02", CourseCode: "24MB206", RegisterNos: func() []string {
			return expandRange("7376257MB131", "7376257MB147")
		}()},

		// S.No 99 - SF B02 - B.Tech. AG - 22PH202
		{HallNo: "SF B02", CourseCode: "22PH202", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252AG106", "7376252AG113")...)
			r = append(r, expandRange("7376252AG115", "7376252AG126")...)
			return r
		}()},

		// S.No 100 - SF B03 - B.E. CE - 22PH202
		{HallNo: "SF B03", CourseCode: "22PH202", RegisterNos: []string{"7376231CE117"}},

		// S.No 101 - SF B03 - B.E. BM - 22PH202
		{HallNo: "SF B03", CourseCode: "22PH202", RegisterNos: []string{"7376231BM107"}},

		// S.No 102 - SF B03 - B.E. SE - 22PH202
		{HallNo: "SF B03", CourseCode: "22PH202", RegisterNos: []string{"7376231SE144"}},

		// S.No 103 - SF B03 - B.Tech. CB - 22CB201
		{HallNo: "SF B03", CourseCode: "22CB201", RegisterNos: []string{
			"7376232CB110", "7376232CB123", "7376232CB133",
		}},

		// S.No 104 - SF B03 - B.Tech. CT - 22PH202
		{HallNo: "SF B03", CourseCode: "22PH202", RegisterNos: []string{"7376232CT122"}},

		// S.No 105 - SF B03 - B.Tech. CB - 22CB201
		{HallNo: "SF B03", CourseCode: "22CB201", RegisterNos: []string{
			"7376242CB116", "7376242CB118",
			"7376242CB119", "7376242CB154",
		}},

		// S.No 106 - SF B03 - Ph.D. IC - 24CS58
		{HallNo: "SF B03", CourseCode: "24CS58", RegisterNos: []string{
			"25144697541", "25194697305",
			"25244697444", "26144691211",
			"26144691534", "26244691201",
			"26244691520", "26244691540",
		}},

		// S.No 107 - SF B03 - M.E. CS - 24CS58
		{HallNo: "SF B03", CourseCode: "24CS58", RegisterNos: []string{
			"7376254CS105", "7376254CS106",
			"7376254CS108", "7376254CS110",
			"7376254CS111",
		}},

		// S.No 108 - SF B03 - B.Tech. AG - 22PH202
		{HallNo: "SF B03", CourseCode: "22PH202", RegisterNos: []string{"7376252AG127"}},

		// S.No 109 - WW 002 - B.Tech. AD - 22PH202
		{HallNo: "WW 002", CourseCode: "22PH202", RegisterNos: []string{"7376242AD320"}},

		// S.No 110 - WW 002 - B.Tech. IT - 22PH202
		{HallNo: "WW 002", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT373", "7376252IT382")
		}()},

		// S.No 111 - WW 002 - B.Tech. AD - 22PH202
		{HallNo: "WW 002", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD101", "7376252AD109")
		}()},

		// S.No 112 - WW 003 - B.E. EC - 22PH202
		{HallNo: "WW 003", CourseCode: "22PH202", RegisterNos: []string{
			"7376231EC101", "7376231EC112",
			"7376231EC121", "7376231EC283",
		}},

		// S.No 113 - WW 003 - B.Tech. IT - 22PH202
		{HallNo: "WW 003", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252IT383", "7376252IT388")
		}()},

		// S.No 114 - WW 003 - B.Tech. AD - 22PH202
		{HallNo: "WW 003", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD110", "7376252AD119")
		}()},

		// S.No 115 - WW 004 - B.E. EC - 22PH202
		{HallNo: "WW 004", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC128", "7376251EC137")
		}()},

		// S.No 116 - WW 004 - B.Tech. AD - 22PH202
		{HallNo: "WW 004", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD155", "7376252AD164")
		}()},

		// S.No 117 - WW 005 - B.E. EC - 22PH202
		{HallNo: "WW 005", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC138", "7376251EC147")
		}()},

		// S.No 118 - WW 005 - B.Tech. AD - 22PH202
		{HallNo: "WW 005", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD165", "7376252AD179")
		}()},

		// S.No 119 - WW 006 - B.E. EC - 22PH202
		{HallNo: "WW 006", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC168", "7376251EC177")
		}()},

		// S.No 120 - WW 006 - B.Tech. AD - 22PH202
		{HallNo: "WW 006", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD210", "7376252AD224")
		}()},

		// S.No 121 - WW 007 - B.E. EC - 22PH202
		{HallNo: "WW 007", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC178", "7376251EC187")
		}()},

		// S.No 122 - WW 007 - B.Tech. AD - 22PH202
		{HallNo: "WW 007", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD225", "7376252AD239")
		}()},

		// S.No 123 - WW 008 - B.E. EC - 22PH202
		{HallNo: "WW 008", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC188", "7376251EC197")
		}()},

		// S.No 124 - WW 008 - B.Tech. AD - 22PH202
		{HallNo: "WW 008", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD240", "7376252AD254")
		}()},

		// S.No 125 - WW 011 - B.E. EC - 22PH202
		{HallNo: "WW 011", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC253", "7376251EC262")
		}()},

		// S.No 126 - WW 011 - B.Tech. AD - 22PH202
		{HallNo: "WW 011", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD325", "7376252AD339")
		}()},

		// S.No 127 - WW 012 - B.E. EC - 22PH202
		{HallNo: "WW 012", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC274", "7376251EC283")
		}()},

		// S.No 128 - WW 012 - B.Tech. AD - 22PH202
		{HallNo: "WW 012", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AD355", "7376252AD369")
		}()},

		// S.No 129 - WW 216 - B.E. EC - 22PH202
		{HallNo: "WW 216", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC314", "7376251EC323")
		}()},

		// S.No 130 - WW 216 - B.Tech. AL - 22PH202
		{HallNo: "WW 216", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AL130", "7376252AL139")
		}()},

		// S.No 131 - WW 217 - B.E. EC - 22PH202
		{HallNo: "WW 217", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EC334", "7376251EC343")
		}()},

		// S.No 132 - WW 217 - B.Tech. AL - 22PH202
		{HallNo: "WW 217", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AL155", "7376252AL164")
		}()},

		// S.No 133 - WW 218 - B.Tech. BT - 22PH202
		{HallNo: "WW 218", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252BT136", "7376252BT145")
		}()},

		// S.No 134 - WW 218 - B.Tech. AL - 22PH202
		{HallNo: "WW 218", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AL210", "7376252AL224")
		}()},

		// S.No 135 - WW 219 - B.Tech. BT - 22PH202
		{HallNo: "WW 219", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252BT146", "7376252BT155")
		}()},

		// S.No 136 - WW 219 - B.Tech. AL - 22PH202
		{HallNo: "WW 219", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AL225", "7376252AL239")
		}()},

		// S.No 137 - WW 220 - B.E. EE - 22PH202
		{HallNo: "WW 220", CourseCode: "22PH202", RegisterNos: []string{
			"7376241EE147", "7376241EE193",
		}},

		// S.No 138 - WW 220 - B.E. EE - 22PH202
		{HallNo: "WW 220", CourseCode: "22PH202", RegisterNos: []string{"7376251EE102"}},

		// S.No 139 - WW 220 - B.Tech. BT - 22PH202
		{HallNo: "WW 220", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252BT156", "7376252BT165")
		}()},

		// S.No 140 - WW 220 - B.Tech. AL - 22PH202
		{HallNo: "WW 220", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252AL240", "7376252AL246")
		}()},

		// S.No 141 - WW 221 - B.E. EE - 22PH202
		{HallNo: "WW 221", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EE103", "7376251EE112")
		}()},

		// S.No 142 - WW 221 - B.Tech. BT - 22PH202
		{HallNo: "WW 221", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252BT166", "7376252BT175")
		}()},

		// S.No 143 - WW 222 - B.E. EE - 22PH202
		{HallNo: "WW 222", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EE113", "7376251EE137")
		}()},

		// S.No 144 - WW 222 - B.Tech. BT - 22PH202
		{HallNo: "WW 222", CourseCode: "22PH202", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252BT176", "7376252BT189")...)
			r = append(r, expandRange("7376252BT191", "7376252BT197")...)
			r = append(r, expandRange("7376252BT199", "7376252BT202")...)
			return r
		}()},

		// S.No 145 - WW 223 - B.E. MZ - 22PH202
		{HallNo: "WW 223", CourseCode: "22PH202", RegisterNos: []string{
			"7376231MZ106", "7376231MZ111", "7376231MZ113",
		}},

		// S.No 146 - WW 223 - B.E. EE - 22PH202
		{HallNo: "WW 223", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EE138", "7376251EE162")
		}()},

		// S.No 147 - WW 223 - B.Tech. BT - 22PH202
		{HallNo: "WW 223", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376252BT203", "7376252BT224")
		}()},

		// S.No 148 - WW 224 - B.E. MZ - 22PH202
		{HallNo: "WW 224", CourseCode: "22PH202", RegisterNos: []string{"7376241MZ124"}},

		// S.No 149 - WW 224 - B.E. EE - 22PH202
		{HallNo: "WW 224", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EE163", "7376251EE187")
		}()},

		// S.No 150 - WW 224 - B.E. MZ - 22PH202
		{HallNo: "WW 224", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251MZ101", "7376251MZ124")
		}()},

		// S.No 151 - WW 225 - B.E. EI - 22PH202
		{HallNo: "WW 225", CourseCode: "22PH202", RegisterNos: []string{"7376231EI159"}},

		// S.No 152 - WW 225 - B.E. EI - 22PH202
		{HallNo: "WW 225", CourseCode: "22PH202", RegisterNos: []string{"7376241EI133"}},

		// S.No 153 - WW 225 - B.E. EE - 22PH202
		{HallNo: "WW 225", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EE188", "7376251EE205")
		}()},

		// S.No 154 - WW 225 - B.E. EI - 22PH202
		{HallNo: "WW 225", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EI101", "7376251EI105")
		}()},

		// S.No 155 - WW 225 - B.E. MZ - 22PH202
		{HallNo: "WW 225", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251MZ125", "7376251MZ149")
		}()},

		// S.No 156 - WW 226 - B.E. ME - 22PH202
		{HallNo: "WW 226", CourseCode: "22PH202", RegisterNos: []string{"7376241ME124"}},

		// S.No 157 - WW 226 - B.E. EI - 22PH202
		{HallNo: "WW 226", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EI106", "7376251EI130")
		}()},

		// S.No 158 - WW 226 - B.E. ME - 22PH202
		{HallNo: "WW 226", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251ME102", "7376251ME112")
		}()},

		// S.No 159 - WW 226 - B.E. MZ - 22PH202
		{HallNo: "WW 226", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251MZ150", "7376251MZ162")
		}()},

		// S.No 160 - WW 227 - B.E. EI - 22PH202
		{HallNo: "WW 227", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251EI131", "7376251EI155")
		}()},

		// S.No 161 - WW 227 - B.E. ME - 22PH202
		{HallNo: "WW 227", CourseCode: "22PH202", RegisterNos: func() []string {
			return expandRange("7376251ME113", "7376251ME137")
		}()},
	}
}

// buildSeatingData24June2026AN returns seating records for 24-06-2026 AN session (01:30 PM to 04:30 PM)
func buildSeatingData24June2026AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.Tech. CB - 22CB106
		{HallNo: "EW 101", CourseCode: "22CB106", RegisterNos: []string{"7376232CB106"}},

		// S.No 2 - EW 101 - B.Tech. CB - 22CB106
		{HallNo: "EW 101", CourseCode: "22CB106", RegisterNos: []string{
			"7376242CB116", "7376242CB118",
			"7376242CB119", "7376242CB147",
			"7376242CB153", "7376242CB154",
		}},

		// S.No 3 - EW 101 - M.B.A. - 24MB106
		{HallNo: "EW 101", CourseCode: "24MB106", RegisterNos: []string{
			"7376257MB126", "7376257MB130",
		}},
	}
}
func buildSeatingData29June2026FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 301 - B.E. EI - 22CH203
		{HallNo: "AE 301", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EI127", "7376251EI141")
		}()},

		// S.No 2 - AE 301 - B.E. ME - 22CH203
		{HallNo: "AE 301", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251ME133", "7376251ME142")
		}()},

		// S.No 3 - AE 302 - B.E. CS - 22CH203
		{HallNo: "AE 302", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS212", "7376251CS226")
		}()},

		// S.No 4 - AE 302 - B.Tech. IT - 22CH203
		{HallNo: "AE 302", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT189", "7376252IT198")
		}()},

		// S.No 5 - EW 101 - B.E. CS - 22CH203
		{HallNo: "EW 101", CourseCode: "22CH203", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376251CS227", "7376251CS228")
			r = append(r, expandRange("7376251CS230", "7376251CS242")...)
			return r
		}()},

		// S.No 6 - EW 101 - B.Tech. IT - 22CH203
		{HallNo: "EW 101", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT199", "7376252IT208")
		}()},

		// S.No 7 - EW 102 - B.E. CS - 22CH203
		{HallNo: "EW 102", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS243", "7376251CS257")
		}()},

		// S.No 8 - EW 102 - B.Tech. IT - 22CH203
		{HallNo: "EW 102", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT209", "7376252IT218")
		}()},

		// S.No 9 - EW 103 - B.E. CS - 22CH203
		{HallNo: "EW 103", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS273", "7376251CS287")
		}()},

		// S.No 10 - EW 103 - B.Tech. IT - 22CH203
		{HallNo: "EW 103", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT229", "7376252IT238")
		}()},

		// S.No 11 - EW 104 - B.E. CS - 22CH203
		{HallNo: "EW 104", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS333", "7376251CS347")
		}()},

		// S.No 12 - EW 104 - B.Tech. IT - 22CH203
		{HallNo: "EW 104", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT269", "7376252IT278")
		}()},

		// S.No 13 - EW 105 - B.E. CS - 22CH203
		{HallNo: "EW 105", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS348", "7376251CS362")
		}()},

		// S.No 14 - EW 105 - B.Tech. IT - 22CH203
		{HallNo: "EW 105", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT279", "7376252IT288")
		}()},

		// S.No 15 - EW 106 - B.E. CS - 22CH203
		{HallNo: "EW 106", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS393", "7376251CS407")
		}()},

		// S.No 16 - EW 106 - B.Tech. IT - 22CH203
		{HallNo: "EW 106", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT309", "7376252IT318")
		}()},

		// S.No 17 - EW 107 - B.E. CS - 22CH203
		{HallNo: "EW 107", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS258", "7376251CS272")
		}()},

		// S.No 18 - EW 107 - B.Tech. IT - 22CH203
		{HallNo: "EW 107", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT219", "7376252IT228")
		}()},

		// S.No 19 - EW 108 - B.E. CS - 22CH203
		{HallNo: "EW 108", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS288", "7376251CS302")
		}()},

		// S.No 20 - EW 108 - B.Tech. IT - 22CH203
		{HallNo: "EW 108", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT239", "7376252IT248")
		}()},

		// S.No 21 - EW 109 - B.E. CS - 22CH203
		{HallNo: "EW 109", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS303", "7376251CS317")
		}()},

		// S.No 22 - EW 109 - B.Tech. IT - 22CH203
		{HallNo: "EW 109", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT249", "7376252IT258")
		}()},

		// S.No 23 - EW 111 - B.E. CS - 22CH203
		{HallNo: "EW 111", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS318", "7376251CS332")
		}()},

		// S.No 24 - EW 111 - B.Tech. IT - 22CH203
		{HallNo: "EW 111", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT259", "7376252IT268")
		}()},

		// S.No 25 - EW 112 - B.E. CS - 22CH203
		{HallNo: "EW 112", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS363", "7376251CS377")
		}()},

		// S.No 26 - EW 112 - B.Tech. IT - 22CH203
		{HallNo: "EW 112", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT289", "7376252IT298")
		}()},

		// S.No 27 - EW 113 - B.E. EC - 22CH203
		{HallNo: "EW 113", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC143", "7376251EC152")
		}()},

		// S.No 28 - EW 113 - B.Tech. AD - 22CH203
		{HallNo: "EW 113", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD161", "7376252AD175")
		}()},

		// S.No 29 - EW 114 - B.E. EC - 22CH203
		{HallNo: "EW 114", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC203", "7376251EC212")
		}()},

		// S.No 30 - EW 114 - B.Tech. AD - 22CH203
		{HallNo: "EW 114", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD246", "7376252AD260")
		}()},

		// S.No 31 - EW 115 - B.E. EC - 22CH203
		{HallNo: "EW 115", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC248", "7376251EC257")
		}()},

		// S.No 32 - EW 115 - B.Tech. AD - 22CH203
		{HallNo: "EW 115", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD296", "7376252AD310")
		}()},

		// S.No 33 - EW 116 - B.E. EC - 22CH203
		{HallNo: "EW 116", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC258", "7376251EC267")
		}()},

		// S.No 34 - EW 116 - B.Tech. AD - 22CH203
		{HallNo: "EW 116", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD311", "7376252AD325")
		}()},

		// S.No 35 - EW 117 - B.E. EC - 22CH203
		{HallNo: "EW 117", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC279", "7376251EC288")
		}()},

		// S.No 36 - EW 117 - B.Tech. AD - 22CH203
		{HallNo: "EW 117", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD341", "7376252AD355")
		}()},

		// S.No 37 - EW 118 - B.Tech. AL - 22CH203
		{HallNo: "EW 118", CourseCode: "22CH203", RegisterNos: []string{
			"7376232AL157", "7376232AL217",
		}},

		// S.No 38 - EW 118 - B.Tech. AL - 22CH203
		{HallNo: "EW 118", CourseCode: "22CH203", RegisterNos: []string{
			"7376242AL157", "7376242AL171",
		}},

		// S.No 39 - EW 118 - B.E. EC - 22CH203
		{HallNo: "EW 118", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC299", "7376251EC308")
		}()},

		// S.No 40 - EW 118 - B.Tech. AD - 22CH203
		{HallNo: "EW 118", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD371", "7376252AD381")
		}()},

		// S.No 41 - EW 201 - B.E. CS - 22CH203
		{HallNo: "EW 201", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS423", "7376251CS437")
		}()},

		// S.No 42 - EW 201 - B.Tech. IT - 22CH203
		{HallNo: "EW 201", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT329", "7376252IT338")
		}()},

		// S.No 43 - EW 202 - B.E. CS - 22CH203
		{HallNo: "EW 202", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS453", "7376251CS467")
		}()},

		// S.No 44 - EW 202 - B.Tech. IT - 22CH203
		{HallNo: "EW 202", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT349", "7376252IT358")
		}()},

		// S.No 45 - EW 203 - B.E. EC - 22CH203
		{HallNo: "EW 203", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC153", "7376251EC162")
		}()},

		// S.No 46 - EW 203 - B.Tech. AD - 22CH203
		{HallNo: "EW 203", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD176", "7376252AD190")
		}()},

		// S.No 47 - EW 204 - B.E. EC - 22CH203
		{HallNo: "EW 204", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC183", "7376251EC192")
		}()},

		// S.No 48 - EW 204 - B.Tech. AD - 22CH203
		{HallNo: "EW 204", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD221", "7376252AD230")
		}()},

		// S.No 49 - EW 205 - B.E. EC - 22CH203
		{HallNo: "EW 205", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC213", "7376251EC222")
		}()},

		// S.No 50 - EW 205 - B.Tech. AD - 22CH203
		{HallNo: "EW 205", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD261", "7376252AD270")
		}()},

		// S.No 51 - EW 206 - B.E. EC - 22CH203
		{HallNo: "EW 206", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC223", "7376251EC247")
		}()},

		// S.No 52 - EW 206 - B.Tech. AD - 22CH203
		{HallNo: "EW 206", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD271", "7376252AD295")
		}()},

		// S.No 53 - EW 207 - B.E. CS - 22CH203
		{HallNo: "EW 207", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS378", "7376251CS392")
		}()},

		// S.No 54 - EW 207 - B.Tech. IT - 22CH203
		{HallNo: "EW 207", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT299", "7376252IT308")
		}()},

		// S.No 55 - EW 208 - B.E. CS - 22CH203
		{HallNo: "EW 208", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS408", "7376251CS422")
		}()},

		// S.No 56 - EW 208 - B.Tech. IT - 22CH203
		{HallNo: "EW 208", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT319", "7376252IT328")
		}()},

		// S.No 57 - EW 209 - B.E. CS - 22CH203
		{HallNo: "EW 209", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS438", "7376251CS452")
		}()},

		// S.No 58 - EW 209 - B.Tech. IT - 22CH203
		{HallNo: "EW 209", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT339", "7376252IT348")
		}()},

		// S.No 59 - EW 210 - B.E. CS - 22CH203
		{HallNo: "EW 210", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS468", "7376251CS477")
		}()},

		// S.No 60 - EW 210 - B.Tech. IT - 22CH203
		{HallNo: "EW 210", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT359", "7376252IT368")
		}()},

		// S.No 61 - EW 211 - B.E. EC - 22CH203
		{HallNo: "EW 211", CourseCode: "22CH203", RegisterNos: []string{
			"7376231EC101", "7376231EC110",
			"7376231EC112", "7376231EC121",
			"7376231EC283", "7376231EC331",
			"7376231EC334",
		}},

		// S.No 62 - EW 211 - B.E. EC - 22CH203
		{HallNo: "EW 211", CourseCode: "22CH203", RegisterNos: []string{
			"7376241EC111", "7376241EC144",
			"7376241EC147",
		}},

		// S.No 63 - EW 211 - B.Tech. AD - 22CH203
		{HallNo: "EW 211", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD101", "7376252AD110")
		}()},

		// S.No 64 - EW 212 - B.E. EC - 22CH203
		{HallNo: "EW 212", CourseCode: "22CH203", RegisterNos: []string{
			"7376241EC171", "7376241EC256",
			"7376241EC319",
		}},

		// S.No 65 - EW 212 - B.E. EC - 22CH203
		{HallNo: "EW 212", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC101", "7376251EC122")
		}()},

		// S.No 66 - EW 212 - B.Tech. AD - 22CH203
		{HallNo: "EW 212", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD111", "7376252AD135")
		}()},

		// S.No 67 - EW 213 - B.Tech. AL - 22CH203
		{HallNo: "EW 213", CourseCode: "22CH203", RegisterNos: []string{
			"7376242AL197", "7376242AL207",
		}},

		// S.No 68 - EW 213 - B.E. EC - 22CH203
		{HallNo: "EW 213", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC309", "7376251EC318")
		}()},

		// S.No 69 - EW 213 - B.Tech. AL - 22CH203
		{HallNo: "EW 213", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AL101", "7376252AL113")
		}()},

		// S.No 70 - EW 214 - B.E. EC - 22CH203
		{HallNo: "EW 214", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC319", "7376251EC328")
		}()},

		// S.No 71 - EW 214 - B.Tech. AL - 22CH203
		{HallNo: "EW 214", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AL114", "7376252AL128")
		}()},

		// S.No 72 - EW 215 - B.E. EC - 22CH203
		{HallNo: "EW 215", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC329", "7376251EC338")
		}()},

		// S.No 73 - EW 215 - B.Tech. AL - 22CH203
		{HallNo: "EW 215", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AL129", "7376252AL143")
		}()},

		// S.No 74 - EW 216 - B.E. EC - 22CH203
		{HallNo: "EW 216", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC339", "7376251EC348")
		}()},

		// S.No 75 - EW 216 - B.Tech. AL - 22CH203
		{HallNo: "EW 216", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AL144", "7376252AL153")
		}()},

		// S.No 76 - EW 217 - B.Tech. BT - 22CH203
		{HallNo: "EW 217", CourseCode: "22CH203", RegisterNos: []string{"7376242BT156"}},

		// S.No 77 - EW 217 - B.E. EC - 22CH203
		{HallNo: "EW 217", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC349", "7376251EC352")
		}()},

		// S.No 78 - EW 217 - B.Tech. BT - 22CH203
		{HallNo: "EW 217", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252BT102", "7376252BT106")
		}()},

		// S.No 79 - EW 217 - B.Tech. AL - 22CH203
		{HallNo: "EW 217", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AL154", "7376252AL163")
		}()},

		// S.No 80 - EW 218 - B.Tech. BT - 22CH203
		{HallNo: "EW 218", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252BT107", "7376252BT131")
		}()},

		// S.No 81 - EW 218 - B.Tech. AL - 22CH203
		{HallNo: "EW 218", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AL164", "7376252AL188")
		}()},

		// S.No 82 - MECH DH - B.E. CS - 22CH203
		{HallNo: "MECH DH", CourseCode: "22CH203", RegisterNos: []string{
			"7376241CS332", "7376241CS395",
			"7376241CS410", "7376241CS416",
			"7376241CS425", "7376241CS467",
			"7376241CS473", "7376241CS474",
		}},

		// S.No 83 - MECH DH - B.Tech. IT - 22CH203
		{HallNo: "MECH DH", CourseCode: "22CH203", RegisterNos: []string{
			"7376242IT146", "7376242IT155",
			"7376242IT164", "7376242IT184",
			"7376242IT201", "7376242IT214",
			"7376242IT226", "7376242IT257",
			"7376242IT272", "7376242IT287",
			"7376242IT292", "7376242IT298",
			"7376242IT318", "7376242IT324",
			"7376242IT348",
		}},

		// S.No 84 - MECH DH - B.E. CS - 22CH203
		{HallNo: "MECH DH", CourseCode: "22CH203", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS101", "7376251CS128")...)
			r = append(r, expandRange("7376251CS130", "7376251CS165")...)
			return r
		}()},

		// S.No 85 - MECH DH - B.Tech. IT - 22CH203
		{HallNo: "MECH DH", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT102", "7376252IT158")
		}()},

		// S.No 86 - MH 302 - B.E. CS - 22CH203
		{HallNo: "MH 302", CourseCode: "22CH203", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS166", "7376251CS168")...)
			r = append(r, expandRange("7376251CS170", "7376251CS181")...)
			return r
		}()},

		// S.No 87 - MH 302 - B.Tech. IT - 22CH203
		{HallNo: "MH 302", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT159", "7376252IT168")
		}()},

		// S.No 88 - MH 303 - B.E. CS - 22CH203
		{HallNo: "MH 303", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS182", "7376251CS196")
		}()},

		// S.No 89 - MH 303 - B.Tech. IT - 22CH203
		{HallNo: "MH 303", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT169", "7376252IT178")
		}()},

		// S.No 90 - MH 305 - B.E. CS - 22CH203
		{HallNo: "MH 305", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251CS197", "7376251CS211")
		}()},

		// S.No 91 - MH 305 - B.Tech. IT - 22CH203
		{HallNo: "MH 305", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT179", "7376252IT188")
		}()},

		// S.No 92 - MH 306 - B.E. CS - 22CH203
		{HallNo: "MH 306", CourseCode: "22CH203", RegisterNos: []string{
			"7376231CS190", "7376231CS207",
			"7376231CS244", "7376231CS259",
			"7376231CS288",
		}},

		// S.No 93 - MH 306 - B.Tech. IT - 22CH203
		{HallNo: "MH 306", CourseCode: "22CH203", RegisterNos: []string{
			"7376232IT118", "7376232IT139",
			"7376232IT152", "7376232IT177",
			"7376232IT224", "7376232IT274",
			"7376232IT282",
		}},

		// S.No 94 - MH 306 - B.E. CS - 22CH203
		{HallNo: "MH 306", CourseCode: "22CH203", RegisterNos: []string{
			"7376241CS103", "7376241CS166",
			"7376241CS171", "7376241CS230",
			"7376241CS248", "7376241CS249",
			"7376241CS257", "7376241CS272",
			"7376241CS288", "7376241CS318",
		}},

		// S.No 95 - MH 306 - B.Tech. IT - 22CH203
		{HallNo: "MH 306", CourseCode: "22CH203", RegisterNos: []string{
			"7376242IT108", "7376242IT110",
			"7376242IT141",
		}},

		// S.No 96 - SF B01 - M.E. IS - 24IS63
		{HallNo: "SF B01", CourseCode: "24IS63", RegisterNos: []string{
			"7376254IS101", "7376254IS102",
		}},

		// S.No 97 - SF B01 - B.E. EI - 22CH203
		{HallNo: "SF B01", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EI142", "7376251EI161")
		}()},

		// S.No 98 - SF B01 - B.E. ME - 22CH203
		{HallNo: "SF B01", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251ME143", "7376251ME160")
		}()},

		// S.No 99 - SF B02 - B.E. BM - 22CH203
		{HallNo: "SF B02", CourseCode: "22CH203", RegisterNos: []string{
			"7376231BM107", "7376231BM148",
		}},

		// S.No 100 - SF B02 - B.E. SE - 22CH203
		{HallNo: "SF B02", CourseCode: "22CH203", RegisterNos: []string{
			"7376231SE122", "7376231SE144",
			"7376231SE153",
		}},

		// S.No 101 - SF B02 - B.Tech. CB - 22CB205
		{HallNo: "SF B02", CourseCode: "22CB205", RegisterNos: []string{"7376232CB133"}},

		// S.No 102 - SF B02 - B.Tech. AG - 22CH203
		{HallNo: "SF B02", CourseCode: "22CH203", RegisterNos: []string{
			"7376232AG111", "7376232AG113",
			"7376232AG129", "7376232AG132",
			"7376232AG151",
		}},

		// S.No 103 - SF B02 - B.Tech. CB - 22CB205
		{HallNo: "SF B02", CourseCode: "22CB205", RegisterNos: []string{
			"7376242CB116", "7376242CB118",
			"7376242CB154",
		}},

		// S.No 104 - SF B02 - Ph.D. IC - 24CS57
		{HallNo: "SF B02", CourseCode: "24CS57", RegisterNos: []string{
			"25144697541", "25144697545",
			"25244697444",
		}},

		// S.No 105 - SF B02 - M.E. CS - 24CS57
		{HallNo: "SF B02", CourseCode: "24CS57", RegisterNos: []string{
			"7376254CS105", "7376254CS110",
		}},

		// S.No 106 - SF B02 - M.E. IS - 24IS63
		{HallNo: "SF B02", CourseCode: "24IS63", RegisterNos: func() []string {
			return expandRange("7376254IS103", "7376254IS108")
		}()},

		// S.No 107 - SF B02 - B.E. EI - 22CH203
		{HallNo: "SF B02", CourseCode: "22CH203", RegisterNos: []string{"7376251EI162"}},

		// S.No 108 - SF B02 - B.Tech. AG - 22CH203
		{HallNo: "SF B02", CourseCode: "22CH203", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252AG101", "7376252AG113")...)
			r = append(r, "7376252AG115")
			return r
		}()},

		// S.No 109 - SF B03 - B.E. CE - 22CH203
		{HallNo: "SF B03", CourseCode: "22CH203", RegisterNos: []string{
			"7376231CE108", "7376231CE117",
			"7376231CE120",
		}},

		// S.No 110 - SF B03 - B.E. CD - 22CH203
		{HallNo: "SF B03", CourseCode: "22CH203", RegisterNos: []string{
			"7376231CD111", "7376231CD143",
		}},

		// S.No 111 - SF B03 - B.Tech. FT - 22CH203
		{HallNo: "SF B03", CourseCode: "22CH203", RegisterNos: []string{"7376232FT101"}},

		// S.No 112 - SF B03 - B.Tech. CT - 22CH203
		{HallNo: "SF B03", CourseCode: "22CH203", RegisterNos: []string{
			"7376232CT102", "7376232CT122",
			"7376232CT127",
		}},

		// S.No 113 - SF B03 - Ph.D. IC - 24CS57
		{HallNo: "SF B03", CourseCode: "24CS57", RegisterNos: []string{
			"25244697473", "25244697503",
			"26234691327",
		}},

		// S.No 114 - SF B03 - B.Tech. AG - 22CH203
		{HallNo: "SF B03", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AG116", "7376252AG127")
		}()},

		// S.No 115 - WW 002 - B.Tech. AD - 22CH203
		{HallNo: "WW 002", CourseCode: "22CH203", RegisterNos: []string{
			"7376232AD115", "7376232AD184",
			"7376232AD250", "7376232AD282",
		}},

		// S.No 116 - WW 002 - B.Tech. AD - 22CH203
		{HallNo: "WW 002", CourseCode: "22CH203", RegisterNos: []string{
			"7376242AD107", "7376242AD137",
			"7376242AD183", "7376242AD189",
		}},

		// S.No 117 - WW 002 - B.E. CS - 22CH203
		{HallNo: "WW 002", CourseCode: "22CH203", RegisterNos: []string{
			"7376251CS478", "7376251CS479",
		}},

		// S.No 118 - WW 002 - B.Tech. IT - 22CH203
		{HallNo: "WW 002", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT369", "7376252IT378")
		}()},

		// S.No 119 - WW 003 - B.Tech. AD - 22CH203
		{HallNo: "WW 003", CourseCode: "22CH203", RegisterNos: []string{
			"7376242AD190", "7376242AD202",
			"7376242AD218", "7376242AD242",
			"7376242AD291", "7376242AD308",
			"7376242AD320", "7376242AD322",
			"7376242AD326", "7376242AD343",
		}},

		// S.No 120 - WW 003 - B.Tech. IT - 22CH203
		{HallNo: "WW 003", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252IT379", "7376252IT388")
		}()},

		// S.No 121 - WW 004 - B.E. EC - 22CH203
		{HallNo: "WW 004", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC123", "7376251EC132")
		}()},

		// S.No 122 - WW 004 - B.Tech. AD - 22CH203
		{HallNo: "WW 004", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD136", "7376252AD145")
		}()},

		// S.No 123 - WW 005 - B.E. EC - 22CH203
		{HallNo: "WW 005", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC133", "7376251EC142")
		}()},

		// S.No 124 - WW 005 - B.Tech. AD - 22CH203
		{HallNo: "WW 005", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD146", "7376252AD160")
		}()},

		// S.No 125 - WW 006 - B.E. EC - 22CH203
		{HallNo: "WW 006", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC163", "7376251EC172")
		}()},

		// S.No 126 - WW 006 - B.Tech. AD - 22CH203
		{HallNo: "WW 006", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD191", "7376252AD205")
		}()},

		// S.No 127 - WW 007 - B.E. EC - 22CH203
		{HallNo: "WW 007", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC173", "7376251EC182")
		}()},

		// S.No 128 - WW 007 - B.Tech. AD - 22CH203
		{HallNo: "WW 007", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD206", "7376252AD220")
		}()},

		// S.No 129 - WW 008 - B.E. EC - 22CH203
		{HallNo: "WW 008", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC193", "7376251EC202")
		}()},

		// S.No 130 - WW 008 - B.Tech. AD - 22CH203
		{HallNo: "WW 008", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD231", "7376252AD245")
		}()},

		// S.No 131 - WW 011 - B.E. EC - 22CH203
		{HallNo: "WW 011", CourseCode: "22CH203", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376251EC268", "7376251EC269")
			r = append(r, expandRange("7376251EC271", "7376251EC278")...)
			return r
		}()},

		// S.No 132 - WW 011 - B.Tech. AD - 22CH203
		{HallNo: "WW 011", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD326", "7376252AD340")
		}()},

		// S.No 133 - WW 012 - B.E. EC - 22CH203
		{HallNo: "WW 012", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EC289", "7376251EC298")
		}()},

		// S.No 134 - WW 012 - B.Tech. AD - 22CH203
		{HallNo: "WW 012", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AD356", "7376252AD370")
		}()},

		// S.No 135 - WW 218 - B.Tech. BT - 22CH203
		{HallNo: "WW 218", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252BT132", "7376252BT141")
		}()},

		// S.No 136 - WW 218 - B.Tech. AL - 22CH203
		{HallNo: "WW 218", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AL189", "7376252AL203")
		}()},

		// S.No 137 - WW 219 - B.Tech. BT - 22CH203
		{HallNo: "WW 219", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252BT142", "7376252BT151")
		}()},

		// S.No 138 - WW 219 - B.Tech. AL - 22CH203
		{HallNo: "WW 219", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AL204", "7376252AL218")
		}()},

		// S.No 139 - WW 220 - B.Tech. BT - 22CH203
		{HallNo: "WW 220", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252BT152", "7376252BT161")
		}()},

		// S.No 140 - WW 220 - B.Tech. AL - 22CH203
		{HallNo: "WW 220", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AL219", "7376252AL228")
		}()},

		// S.No 141 - WW 221 - B.Tech. BT - 22CH203
		{HallNo: "WW 221", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252BT162", "7376252BT171")
		}()},

		// S.No 142 - WW 221 - B.Tech. AL - 22CH203
		{HallNo: "WW 221", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AL229", "7376252AL238")
		}()},

		// S.No 143 - WW 222 - B.E. EE - 22CH203
		{HallNo: "WW 222", CourseCode: "22CH203", RegisterNos: []string{"7376231EE111"}},

		// S.No 144 - WW 222 - B.E. EE - 22CH203
		{HallNo: "WW 222", CourseCode: "22CH203", RegisterNos: []string{
			"7376241EE115", "7376241EE130",
			"7376241EE132", "7376241EE145",
			"7376241EE147", "7376241EE157",
			"7376241EE188", "7376241EE193",
			"7376241EE208",
		}},

		// S.No 145 - WW 222 - B.E. EE - 22CH203
		{HallNo: "WW 222", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EE102", "7376251EE108")
		}()},

		// S.No 146 - WW 222 - B.Tech. BT - 22CH203
		{HallNo: "WW 222", CourseCode: "22CH203", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252BT172", "7376252BT189")...)
			r = append(r, expandRange("7376252BT191", "7376252BT197")...)
			return r
		}()},

		// S.No 147 - WW 222 - B.Tech. AL - 22CH203
		{HallNo: "WW 222", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252AL239", "7376252AL246")
		}()},

		// S.No 148 - WW 223 - B.E. EE - 22CH203
		{HallNo: "WW 223", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EE109", "7376251EE133")
		}()},

		// S.No 149 - WW 223 - B.Tech. BT - 22CH203
		{HallNo: "WW 223", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376252BT199", "7376252BT223")
		}()},

		// S.No 150 - WW 224 - B.E. MZ - 22CH203
		{HallNo: "WW 224", CourseCode: "22CH203", RegisterNos: []string{
			"7376231MZ106", "7376231MZ111",
			"7376231MZ135", "7376231MZ148",
		}},

		// S.No 151 - WW 224 - B.E. EE - 22CH203
		{HallNo: "WW 224", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EE134", "7376251EE158")
		}()},

		// S.No 152 - WW 224 - B.E. MZ - 22CH203
		{HallNo: "WW 224", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251MZ101", "7376251MZ120")
		}()},

		// S.No 153 - WW 224 - B.Tech. BT - 22CH203
		{HallNo: "WW 224", CourseCode: "22CH203", RegisterNos: []string{"7376252BT224"}},

		// S.No 154 - WW 225 - B.E. EE - 22CH203
		{HallNo: "WW 225", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EE159", "7376251EE183")
		}()},

		// S.No 155 - WW 225 - B.E. MZ - 22CH203
		{HallNo: "WW 225", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251MZ121", "7376251MZ145")
		}()},

		// S.No 156 - WW 226 - B.E. EI - 22CH203
		{HallNo: "WW 226", CourseCode: "22CH203", RegisterNos: []string{
			"7376231EI128", "7376231EI159",
		}},

		// S.No 157 - WW 226 - B.E. ME - 22CH203
		{HallNo: "WW 226", CourseCode: "22CH203", RegisterNos: []string{
			"7376231ME103", "7376231ME149",
		}},

		// S.No 158 - WW 226 - B.E. EE - 22CH203
		{HallNo: "WW 226", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EE184", "7376251EE205")
		}()},

		// S.No 159 - WW 226 - B.E. EI - 22CH203
		{HallNo: "WW 226", CourseCode: "22CH203", RegisterNos: []string{"7376251EI101"}},

		// S.No 160 - WW 226 - B.E. ME - 22CH203
		{HallNo: "WW 226", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251ME102", "7376251ME107")
		}()},

		// S.No 161 - WW 226 - B.E. MZ - 22CH203
		{HallNo: "WW 226", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251MZ146", "7376251MZ162")
		}()},

		// S.No 162 - WW 227 - B.E. EI - 22CH203
		{HallNo: "WW 227", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251EI102", "7376251EI126")
		}()},

		// S.No 163 - WW 227 - B.E. ME - 22CH203
		{HallNo: "WW 227", CourseCode: "22CH203", RegisterNos: func() []string {
			return expandRange("7376251ME108", "7376251ME132")
		}()},
	}
}

// PDF 2: 15__29_06_2026_AN.pdf
// Exam Date: 29-06-2026, Session: AN - 01:30 PM to 04:30 PM
func buildSeatingData29June2026AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. CS - 22GE001
		{HallNo: "EW 101", CourseCode: "22GE001", RegisterNos: []string{
			"7376231CS102", "7376231CS346",
		}},

		// S.No 2 - EW 101 - B.E. CS - 22GE001
		{HallNo: "EW 101", CourseCode: "22GE001", RegisterNos: []string{
			"7376241CS118", "7376241CS141",
			"7376241CS143", "7376241CS151",
			"7376241CS167", "7376241CS185",
			"7376241CS230", "7376241CS257",
			"7376241CS272", "7376241CS288",
			"7376241CS294", "7376241CS297",
			"7376241CS318",
		}},

		// S.No 3 - EW 101 - B.Tech. IT - 22GE001
		{HallNo: "EW 101", CourseCode: "22GE001", RegisterNos: []string{
			"7376242IT110", "7376242IT113",
			"7376242IT129", "7376242IT141",
			"7376242IT146", "7376242IT164",
			"7376242IT184", "7376242IT188",
			"7376242IT201", "7376242IT214",
		}},

		// S.No 4 - EW 102 - B.E. CS - 22GE001
		{HallNo: "EW 102", CourseCode: "22GE001", RegisterNos: []string{
			"7376241CS323", "7376241CS332",
			"7376241CS335", "7376241CS382",
			"7376241CS395", "7376241CS406",
			"7376241CS409", "7376241CS410",
			"7376241CS413", "7376241CS425",
			"7376241CS455", "7376241CS467",
			"7376241CS474",
		}},

		// S.No 5 - EW 102 - B.Tech. IT - 22GE001
		{HallNo: "EW 102", CourseCode: "22GE001", RegisterNos: []string{
			"7376242IT217", "7376242IT226",
			"7376242IT227", "7376242IT250",
			"7376242IT257", "7376242IT300",
			"7376242IT318", "7376242IT324",
			"7376242IT337",
		}},

		// S.No 6 - EW 102 - B.E. CS - 22GE001
		{HallNo: "EW 102", CourseCode: "22GE001", RegisterNos: []string{
			"7376251CS129", "7376251CS166",
		}},

		// S.No 7 - EW 102 - B.Tech. IT - 22GE001
		{HallNo: "EW 102", CourseCode: "22GE001", RegisterNos: []string{"7376252IT122"}},

		// S.No 8 - EW 103 - B.Tech. AD - 22GE001
		{HallNo: "EW 103", CourseCode: "22GE001", RegisterNos: []string{
			"7376242AD107", "7376242AD137",
			"7376242AD183", "7376242AD186",
		}},

		// S.No 9 - EW 103 - B.E. CS - 22GE001
		{HallNo: "EW 103", CourseCode: "22GE001", RegisterNos: []string{
			"7376251CS224", "7376251CS229",
			"7376251CS245", "7376251CS268",
			"7376251CS294", "7376251CS382",
			"7376251CS387", "7376251CS429",
			"7376251CS467", "7376251CS473",
			"7376251CS479",
		}},

		// S.No 10 - EW 103 - B.Tech. IT - 22GE001
		{HallNo: "EW 103", CourseCode: "22GE001", RegisterNos: []string{
			"7376252IT147", "7376252IT172",
			"7376252IT175", "7376252IT178",
			"7376252IT197", "7376252IT202",
			"7376252IT240", "7376252IT253",
			"7376252IT263", "7376252IT312",
		}},

		// S.No 11 - EW 104 - B.Tech. AD - 22GE001
		{HallNo: "EW 104", CourseCode: "22GE001", RegisterNos: []string{
			"7376242AD189", "7376242AD202",
			"7376242AD216", "7376242AD218",
			"7376242AD236", "7376242AD242",
			"7376242AD291", "7376242AD320",
			"7376242AD326",
		}},

		// S.No 12 - EW 104 - B.Tech. AL - 22GE001
		{HallNo: "EW 104", CourseCode: "22GE001", RegisterNos: []string{
			"7376242AL104", "7376242AL114",
			"7376242AL128", "7376242AL144",
			"7376242AL190",
		}},

		// S.No 13 - EW 104 - B.Tech. IT - 22GE001
		{HallNo: "EW 104", CourseCode: "22GE001", RegisterNos: []string{
			"7376252IT326", "7376252IT331",
			"7376252IT353", "7376252IT376",
			"7376252IT386",
		}},

		// S.No 14 - EW 104 - B.Tech. AD - 22GE001
		{HallNo: "EW 104", CourseCode: "22GE001", RegisterNos: []string{
			"7376252AD129", "7376252AD137",
			"7376252AD141", "7376252AD147",
			"7376252AD170", "7376252AD175",
		}},

		// S.No 15 - EW 105 - B.E. EC - 22GE001
		{HallNo: "EW 105", CourseCode: "22GE001", RegisterNos: []string{"7376231EC334"}},

		// S.No 16 - EW 105 - B.Tech. AL - 22GE001
		{HallNo: "EW 105", CourseCode: "22GE001", RegisterNos: []string{
			"7376242AL193", "7376242AL197",
			"7376242AL207", "7376242AL217",
			"7376242AL220",
		}},

		// S.No 17 - EW 105 - B.Tech. AD - 22GE001
		{HallNo: "EW 105", CourseCode: "22GE001", RegisterNos: []string{
			"7376252AD187", "7376252AD192",
			"7376252AD193", "7376252AD201",
			"7376252AD204", "7376252AD214",
			"7376252AD222", "7376252AD238",
			"7376252AD257", "7376252AD316",
			"7376252AD326", "7376252AD331",
			"7376252AD348", "7376252AD364",
		}},

		// S.No 18 - EW 105 - B.Tech. AL - 22GE001
		{HallNo: "EW 105", CourseCode: "22GE001", RegisterNos: []string{
			"7376252AL112", "7376252AL117",
			"7376252AL122", "7376252AL208",
			"7376252AL231",
		}},

		// S.No 19 - EW 106 - B.E. EC - 22GE001
		{HallNo: "EW 106", CourseCode: "22GE001", RegisterNos: []string{
			"7376241EC139", "7376241EC201",
			"7376241EC273", "7376241EC278",
			"7376241EC312", "7376241EC321",
		}},

		// S.No 20 - EW 106 - B.E. EE - 22GE001
		{HallNo: "EW 106", CourseCode: "22GE001", RegisterNos: []string{
			"7376241EE132", "7376241EE145",
			"7376241EE146", "7376241EE147",
			"7376241EE193",
		}},

		// S.No 21 - EW 106 - B.E. ME - 22GE001
		{HallNo: "EW 106", CourseCode: "22GE001", RegisterNos: []string{
			"7376241ME123", "7376241ME127",
		}},

		// S.No 22 - EW 106 - B.E. MZ - 22GE001
		{HallNo: "EW 106", CourseCode: "22GE001", RegisterNos: []string{"7376241MZ124"}},

		// S.No 23 - EW 106 - B.E. EC - 22GE001
		{HallNo: "EW 106", CourseCode: "22GE001", RegisterNos: []string{
			"7376251EC141", "7376251EC205",
			"7376251EC213", "7376251EC248",
			"7376251EC280",
		}},

		// S.No 24 - EW 106 - B.E. EE - 22GE001
		{HallNo: "EW 106", CourseCode: "22GE001", RegisterNos: []string{
			"7376251EE133", "7376251EE144",
			"7376251EE152", "7376251EE192",
		}},

		// S.No 25 - EW 106 - B.E. ME - 22GE001
		{HallNo: "EW 106", CourseCode: "22GE001", RegisterNos: []string{
			"7376251ME119", "7376251ME136",
		}},

		// S.No 26 - EW 201 - B.Tech. CB - 22CB104
		{HallNo: "EW 201", CourseCode: "22CB104", RegisterNos: []string{
			"7376232CB111", "7376232CB123",
		}},

		// S.No 27 - EW 201 - B.E. EI - 22GE001
		{HallNo: "EW 201", CourseCode: "22GE001", RegisterNos: []string{
			"7376241EI133", "7376241EI146",
		}},

		// S.No 28 - EW 201 - B.E. MZ - 22GE001
		{HallNo: "EW 201", CourseCode: "22GE001", RegisterNos: []string{
			"7376241MZ127", "7376241MZ139",
			"7376241MZ143",
		}},

		// S.No 29 - EW 201 - B.Tech. BT - 22GE001
		{HallNo: "EW 201", CourseCode: "22GE001", RegisterNos: []string{
			"7376242BT138", "7376242BT145",
			"7376242BT156", "7376242BT174",
			"7376242BT182",
		}},

		// S.No 30 - EW 201 - B.Tech. CB - 22CB104
		{HallNo: "EW 201", CourseCode: "22CB104", RegisterNos: []string{"7376242CB116"}},

		// S.No 31 - EW 201 - B.E. EI - 22GE001
		{HallNo: "EW 201", CourseCode: "22GE001", RegisterNos: []string{
			"7376251EI126", "7376251EI134",
		}},

		// S.No 32 - EW 201 - B.E. ME - 22GE001
		{HallNo: "EW 201", CourseCode: "22GE001", RegisterNos: []string{
			"7376251ME140", "7376251ME142",
			"7376251ME154", "7376251ME160",
		}},

		// S.No 33 - EW 201 - B.E. MZ - 22GE001
		{HallNo: "EW 201", CourseCode: "22GE001", RegisterNos: []string{
			"7376251MZ104", "7376251MZ105",
			"7376251MZ111", "7376251MZ113",
		}},

		// S.No 34 - EW 201 - B.Tech. BT - 22GE001
		{HallNo: "EW 201", CourseCode: "22GE001", RegisterNos: []string{
			"7376252BT143", "7376252BT198",
		}},

		// S.No 35 - EW 202 - B.E. SE - 22GE001
		{HallNo: "EW 202", CourseCode: "22GE001", RegisterNos: []string{"7376231SE144"}},

		// S.No 36 - EW 202 - B.E. CD - 22GE001
		{HallNo: "EW 202", CourseCode: "22GE001", RegisterNos: []string{"7376231CD115"}},

		// S.No 37 - EW 202 - B.Tech. AG - 22GE001
		{HallNo: "EW 202", CourseCode: "22GE001", RegisterNos: []string{"7376232AG151"}},

		// S.No 38 - EW 202 - B.Tech. CB - 22CB104
		{HallNo: "EW 202", CourseCode: "22CB104", RegisterNos: []string{
			"7376242CB118", "7376242CB154",
		}},

		// S.No 39 - EW 202 - B.E. EI - 22GE001
		{HallNo: "EW 202", CourseCode: "22GE001", RegisterNos: []string{"7376251EI162"}},

		// S.No 40 - EW 202 - B.Tech. AG - 22GE001
		{HallNo: "EW 202", CourseCode: "22GE001", RegisterNos: []string{
			"7376252AG114", "7376252AG119",
			"7376252AG127",
		}},
	}
}

// PDF 3: 16__01_07_2026_FN.pdf
// Exam Date: 01-07-2026, Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData01July2026FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 301 - B.E. ME - 22GE002
		{HallNo: "AE 301", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251ME115", "7376251ME129")
		}()},

		// S.No 2 - AE 301 - B.E. MZ - 22GE002
		{HallNo: "AE 301", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251MZ110", "7376251MZ119")
		}()},

		// S.No 3 - AE 302 - B.E. CS - 22GE002
		{HallNo: "AE 302", CourseCode: "22GE002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS217", "7376251CS228")...)
			r = append(r, expandRange("7376251CS230", "7376251CS232")...)
			return r
		}()},

		// S.No 4 - AE 302 - B.Tech. IT - 22GE002
		{HallNo: "AE 302", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT198", "7376252IT207")
		}()},

		// S.No 5 - EW 101 - B.E. CS - 22GE002
		{HallNo: "EW 101", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS233", "7376251CS247")
		}()},

		// S.No 6 - EW 101 - B.Tech. IT - 22GE002
		{HallNo: "EW 101", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT208", "7376252IT217")
		}()},

		// S.No 7 - EW 102 - B.E. CS - 22GE002
		{HallNo: "EW 102", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS248", "7376251CS262")
		}()},

		// S.No 8 - EW 102 - B.Tech. IT - 22GE002
		{HallNo: "EW 102", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT218", "7376252IT227")
		}()},

		// S.No 9 - EW 103 - B.E. CS - 22GE002
		{HallNo: "EW 103", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS278", "7376251CS292")
		}()},

		// S.No 10 - EW 103 - B.Tech. IT - 22GE002
		{HallNo: "EW 103", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT238", "7376252IT247")
		}()},

		// S.No 11 - EW 104 - B.E. CS - 22GE002
		{HallNo: "EW 104", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS338", "7376251CS352")
		}()},

		// S.No 12 - EW 104 - B.Tech. IT - 22GE002
		{HallNo: "EW 104", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT278", "7376252IT287")
		}()},

		// S.No 13 - EW 105 - B.E. CS - 22GE002
		{HallNo: "EW 105", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS353", "7376251CS367")
		}()},

		// S.No 14 - EW 105 - B.Tech. IT - 22GE002
		{HallNo: "EW 105", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT288", "7376252IT297")
		}()},

		// S.No 15 - EW 106 - B.E. CS - 22GE002
		{HallNo: "EW 106", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS398", "7376251CS412")
		}()},

		// S.No 16 - EW 106 - B.Tech. IT - 22GE002
		{HallNo: "EW 106", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT318", "7376252IT327")
		}()},

		// S.No 17 - EW 107 - B.E. CS - 22GE002
		{HallNo: "EW 107", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS263", "7376251CS277")
		}()},

		// S.No 18 - EW 107 - B.Tech. IT - 22GE002
		{HallNo: "EW 107", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT228", "7376252IT237")
		}()},

		// S.No 19 - EW 108 - B.E. CS - 22GE002
		{HallNo: "EW 108", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS293", "7376251CS307")
		}()},

		// S.No 20 - EW 108 - B.Tech. IT - 22GE002
		{HallNo: "EW 108", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT248", "7376252IT257")
		}()},

		// S.No 21 - EW 109 - B.E. CS - 22GE002
		{HallNo: "EW 109", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS308", "7376251CS322")
		}()},

		// S.No 22 - EW 109 - B.Tech. IT - 22GE002
		{HallNo: "EW 109", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT258", "7376252IT267")
		}()},

		// S.No 23 - EW 111 - B.E. CS - 22GE002
		{HallNo: "EW 111", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS323", "7376251CS337")
		}()},

		// S.No 24 - EW 111 - B.Tech. IT - 22GE002
		{HallNo: "EW 111", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT268", "7376252IT277")
		}()},

		// S.No 25 - EW 112 - B.E. CS - 22GE002
		{HallNo: "EW 112", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS368", "7376251CS382")
		}()},

		// S.No 26 - EW 112 - B.Tech. IT - 22GE002
		{HallNo: "EW 112", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT298", "7376252IT307")
		}()},

		// S.No 27 - EW 113 - B.E. EC - 22GE002
		{HallNo: "EW 113", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC152", "7376251EC161")
		}()},

		// S.No 28 - EW 113 - B.Tech. AD - 22GE002
		{HallNo: "EW 113", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD171", "7376252AD185")
		}()},

		// S.No 29 - EW 114 - B.E. EC - 22GE002
		{HallNo: "EW 114", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC202", "7376251EC211")
		}()},

		// S.No 30 - EW 114 - B.Tech. AD - 22GE002
		{HallNo: "EW 114", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD246", "7376252AD260")
		}()},

		// S.No 31 - EW 115 - B.E. EC - 22GE002
		{HallNo: "EW 115", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC237", "7376251EC246")
		}()},

		// S.No 32 - EW 115 - B.Tech. AD - 22GE002
		{HallNo: "EW 115", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD286", "7376252AD300")
		}()},

		// S.No 33 - EW 116 - B.E. EC - 22GE002
		{HallNo: "EW 116", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC247", "7376251EC256")
		}()},

		// S.No 34 - EW 116 - B.Tech. AD - 22GE002
		{HallNo: "EW 116", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD301", "7376252AD315")
		}()},

		// S.No 35 - EW 117 - B.E. EC - 22GE002
		{HallNo: "EW 117", CourseCode: "22GE002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EC267", "7376251EC269")...)
			r = append(r, expandRange("7376251EC271", "7376251EC277")...)
			return r
		}()},

		// S.No 36 - EW 117 - B.Tech. AD - 22GE002
		{HallNo: "EW 117", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD331", "7376252AD345")
		}()},

		// S.No 37 - EW 118 - B.E. EC - 22GE002
		{HallNo: "EW 118", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC288", "7376251EC297")
		}()},

		// S.No 38 - EW 118 - B.Tech. AD - 22GE002
		{HallNo: "EW 118", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD361", "7376252AD375")
		}()},

		// S.No 39 - EW 201 - B.E. CS - 22GE002
		{HallNo: "EW 201", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS428", "7376251CS442")
		}()},

		// S.No 40 - EW 201 - B.Tech. IT - 22GE002
		{HallNo: "EW 201", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT338", "7376252IT347")
		}()},

		// S.No 41 - EW 202 - B.E. CS - 22GE002
		{HallNo: "EW 202", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS458", "7376251CS472")
		}()},

		// S.No 42 - EW 202 - B.Tech. IT - 22GE002
		{HallNo: "EW 202", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT358", "7376252IT367")
		}()},

		// S.No 43 - EW 203 - B.E. EC - 22GE002
		{HallNo: "EW 203", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC162", "7376251EC171")
		}()},

		// S.No 44 - EW 203 - B.Tech. AD - 22GE002
		{HallNo: "EW 203", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD186", "7376252AD200")
		}()},

		// S.No 45 - EW 206 - B.E. EC - 22GE002
		{HallNo: "EW 206", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC212", "7376251EC236")
		}()},

		// S.No 46 - EW 206 - B.Tech. AD - 22GE002
		{HallNo: "EW 206", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD261", "7376252AD285")
		}()},

		// S.No 47 - EW 207 - B.E. CS - 22GE002
		{HallNo: "EW 207", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS383", "7376251CS397")
		}()},

		// S.No 48 - EW 207 - B.Tech. IT - 22GE002
		{HallNo: "EW 207", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT308", "7376252IT317")
		}()},

		// S.No 49 - EW 208 - B.E. CS - 22GE002
		{HallNo: "EW 208", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS413", "7376251CS427")
		}()},

		// S.No 50 - EW 208 - B.Tech. IT - 22GE002
		{HallNo: "EW 208", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT328", "7376252IT337")
		}()},

		// S.No 51 - EW 209 - B.E. CS - 22GE002
		{HallNo: "EW 209", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS443", "7376251CS457")
		}()},

		// S.No 52 - EW 209 - B.Tech. IT - 22GE002
		{HallNo: "EW 209", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT348", "7376252IT357")
		}()},

		// S.No 53 - EW 210 - B.Tech. AD - 22GE002
		{HallNo: "EW 210", CourseCode: "22GE002", RegisterNos: []string{"7376232AD250"}},

		// S.No 54 - EW 210 - B.Tech. AD - 22GE002
		{HallNo: "EW 210", CourseCode: "22GE002", RegisterNos: []string{
			"7376242AD107", "7376242AD118",
		}},

		// S.No 55 - EW 210 - B.E. CS - 22GE002
		{HallNo: "EW 210", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS473", "7376251CS479")
		}()},

		// S.No 56 - EW 210 - B.Tech. IT - 22GE002
		{HallNo: "EW 210", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT368", "7376252IT377")
		}()},

		// S.No 57 - EW 211 - B.E. EC - 22GE002
		{HallNo: "EW 211", CourseCode: "22GE002", RegisterNos: []string{
			"7376241EC177", "7376241EC256",
			"7376241EC302", "7376241EC312",
		}},

		// S.No 58 - EW 211 - B.E. EC - 22GE002
		{HallNo: "EW 211", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC101", "7376251EC106")
		}()},

		// S.No 59 - EW 211 - B.Tech. AD - 22GE002
		{HallNo: "EW 211", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD111", "7376252AD120")
		}()},

		// S.No 60 - EW 212 - B.E. EC - 22GE002
		{HallNo: "EW 212", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC107", "7376251EC131")
		}()},

		// S.No 61 - EW 212 - B.Tech. AD - 22GE002
		{HallNo: "EW 212", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD121", "7376252AD145")
		}()},

		// S.No 62 - EW 213 - B.Tech. AL - 22GE002
		{HallNo: "EW 213", CourseCode: "22GE002", RegisterNos: []string{
			"7376242AL144", "7376242AL169",
			"7376242AL197", "7376242AL207",
		}},

		// S.No 63 - EW 213 - B.E. EC - 22GE002
		{HallNo: "EW 213", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC298", "7376251EC307")
		}()},

		// S.No 64 - EW 213 - B.Tech. AD - 22GE002
		{HallNo: "EW 213", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD376", "7376252AD381")
		}()},

		// S.No 65 - EW 213 - B.Tech. AL - 22GE002
		{HallNo: "EW 213", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AL101", "7376252AL105")
		}()},

		// S.No 66 - EW 214 - B.E. EC - 22GE002
		{HallNo: "EW 214", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC308", "7376251EC317")
		}()},

		// S.No 67 - EW 214 - B.Tech. AL - 22GE002
		{HallNo: "EW 214", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AL106", "7376252AL120")
		}()},

		// S.No 68 - EW 215 - B.E. EC - 22GE002
		{HallNo: "EW 215", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC318", "7376251EC327")
		}()},

		// S.No 69 - EW 215 - B.Tech. AL - 22GE002
		{HallNo: "EW 215", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AL121", "7376252AL135")
		}()},

		// S.No 70 - EW 217 - B.E. EC - 22GE002
		{HallNo: "EW 217", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC328", "7376251EC337")
		}()},

		// S.No 71 - EW 217 - B.Tech. AL - 22GE002
		{HallNo: "EW 217", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AL136", "7376252AL145")
		}()},

		// S.No 72 - EW 218 - B.Tech. BT - 22GE002
		{HallNo: "EW 218", CourseCode: "22GE002", RegisterNos: []string{"7376232BT142"}},

		// S.No 73 - EW 218 - B.Tech. BT - 22GE002
		{HallNo: "EW 218", CourseCode: "22GE002", RegisterNos: []string{
			"7376242BT145", "7376242BT156",
			"7376242BT170", "7376242BT174",
		}},

		// S.No 74 - EW 218 - B.E. EC - 22GE002
		{HallNo: "EW 218", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC338", "7376251EC352")
		}()},

		// S.No 75 - EW 218 - B.Tech. BT - 22GE002
		{HallNo: "EW 218", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252BT102", "7376252BT106")
		}()},

		// S.No 76 - EW 218 - B.Tech. AL - 22GE002
		{HallNo: "EW 218", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AL146", "7376252AL170")
		}()},

		// S.No 77 - MECH DH - B.E. CS - 22GE002
		{HallNo: "MECH DH", CourseCode: "22GE002", RegisterNos: []string{
			"7376241CS394", "7376241CS395",
			"7376241CS467",
		}},

		// S.No 78 - MECH DH - B.Tech. IT - 22GE002
		{HallNo: "MECH DH", CourseCode: "22GE002", RegisterNos: []string{
			"7376242IT257", "7376242IT287",
			"7376242IT292", "7376242IT318",
			"7376242IT319", "7376242IT339",
		}},

		// S.No 79 - MECH DH - B.E. CS - 22GE002
		{HallNo: "MECH DH", CourseCode: "22GE002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS101", "7376251CS128")...)
			r = append(r, expandRange("7376251CS130", "7376251CS168")...)
			r = append(r, "7376251CS170", "7376251CS171")
			return r
		}()},

		// S.No 80 - MECH DH - B.Tech. IT - 22GE002
		{HallNo: "MECH DH", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT102", "7376252IT167")
		}()},

		// S.No 81 - MH 302 - B.E. CS - 22GE002
		{HallNo: "MH 302", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS172", "7376251CS186")
		}()},

		// S.No 82 - MH 302 - B.Tech. IT - 22GE002
		{HallNo: "MH 302", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT168", "7376252IT177")
		}()},

		// S.No 83 - MH 303 - B.E. CS - 22GE002
		{HallNo: "MH 303", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS187", "7376251CS201")
		}()},

		// S.No 84 - MH 303 - B.Tech. IT - 22GE002
		{HallNo: "MH 303", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT178", "7376252IT187")
		}()},

		// S.No 85 - MH 305 - B.E. CS - 22GE002
		{HallNo: "MH 305", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251CS202", "7376251CS216")
		}()},

		// S.No 86 - MH 305 - B.Tech. IT - 22GE002
		{HallNo: "MH 305", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT188", "7376252IT197")
		}()},

		// S.No 87 - MH 306 - B.E. CS - 22GE002
		{HallNo: "MH 306", CourseCode: "22GE002", RegisterNos: []string{
			"7376231CS102", "7376231CS190",
			"7376231CS244",
		}},

		// S.No 88 - MH 306 - B.Tech. IT - 22GE002
		{HallNo: "MH 306", CourseCode: "22GE002", RegisterNos: []string{
			"7376232IT118", "7376232IT146",
			"7376232IT282",
		}},

		// S.No 89 - MH 306 - B.E. CS - 22GE002
		{HallNo: "MH 306", CourseCode: "22GE002", RegisterNos: []string{
			"7376241CS103", "7376241CS123",
			"7376241CS143", "7376241CS171",
			"7376241CS230", "7376241CS257",
			"7376241CS272", "7376241CS279",
			"7376241CS288", "7376241CS318",
			"7376241CS332", "7376241CS335",
		}},

		// S.No 90 - MH 306 - B.Tech. IT - 22GE002
		{HallNo: "MH 306", CourseCode: "22GE002", RegisterNos: []string{
			"7376242IT141", "7376242IT146",
			"7376242IT164", "7376242IT168",
			"7376242IT184", "7376242IT214",
			"7376242IT227",
		}},

		// S.No 91 - SF B01 - B.E. ME - 22GE002
		{HallNo: "SF B01", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251ME130", "7376251ME149")
		}()},

		// S.No 92 - SF B01 - B.E. MZ - 22GE002
		{HallNo: "SF B01", CourseCode: "22GE002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251MZ120", "7376251MZ127")...)
			r = append(r, expandRange("7376251MZ129", "7376251MZ131")...)
			r = append(r, expandRange("7376251MZ133", "7376251MZ136")...)
			r = append(r, expandRange("7376251MZ139", "7376251MZ143")...)
			return r
		}()},

		// S.No 93 - SF B02 - B.Tech. AG - 22GE002
		{HallNo: "SF B02", CourseCode: "22GE002", RegisterNos: []string{
			"7376232AG113", "7376232AG151",
		}},

		// S.No 94 - SF B02 - Ph.D. IC - 24CS69
		{HallNo: "SF B02", CourseCode: "24CS69", RegisterNos: []string{
			"25144697541", "25144697545",
		}},

		// S.No 95 - SF B02 - B.E. ME - 22GE002
		{HallNo: "SF B02", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251ME150", "7376251ME160")
		}()},

		// S.No 96 - SF B02 - B.E. MZ - 22GE002
		{HallNo: "SF B02", CourseCode: "22GE002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251MZ144", "7376251MZ147")...)
			r = append(r, expandRange("7376251MZ149", "7376251MZ162")...)
			return r
		}()},

		// S.No 97 - SF B02 - B.Tech. AG - 22GE002
		{HallNo: "SF B02", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AG101", "7376252AG107")
		}()},

		// S.No 98 - SF B03 - B.E. BM - 22GE002
		{HallNo: "SF B03", CourseCode: "22GE002", RegisterNos: []string{"7376231BM107"}},

		// S.No 99 - SF B03 - B.E. SE - 22GE002
		{HallNo: "SF B03", CourseCode: "22GE002", RegisterNos: []string{"7376231SE144"}},

		// S.No 100 - SF B03 - B.Tech. CB - 22CB203
		{HallNo: "SF B03", CourseCode: "22CB203", RegisterNos: []string{
			"7376232CB123", "7376232CB133",
		}},

		// S.No 101 - SF B03 - B.Tech. CT - 22GE002
		{HallNo: "SF B03", CourseCode: "22GE002", RegisterNos: []string{"7376232CT122"}},

		// S.No 102 - SF B03 - B.Tech. CB - 22CB203
		{HallNo: "SF B03", CourseCode: "22CB203", RegisterNos: []string{"7376242CB119"}},

		// S.No 103 - SF B03 - Ph.D. IC - 24CS69
		{HallNo: "SF B03", CourseCode: "24CS69", RegisterNos: []string{
			"25244697444", "25244697503",
			"26144691211", "26144691534",
			"26244691201", "26244691520",
			"26244691540",
		}},

		// S.No 104 - SF B03 - M.E. CS - 24CS69
		{HallNo: "SF B03", CourseCode: "24CS69", RegisterNos: []string{
			"7376254CS102", "7376254CS107",
			"7376254CS109",
		}},

		// S.No 105 - SF B03 - B.Tech. AG - 22GE002
		{HallNo: "SF B03", CourseCode: "22GE002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252AG108", "7376252AG113")...)
			r = append(r, expandRange("7376252AG115", "7376252AG127")...)
			return r
		}()},

		// S.No 106 - WW 002 - B.Tech. AD - 22GE002
		{HallNo: "WW 002", CourseCode: "22GE002", RegisterNos: []string{
			"7376242AD129", "7376242AD137",
			"7376242AD183", "7376242AD189",
			"7376242AD202", "7376242AD216",
			"7376242AD218", "7376242AD291",
			"7376242AD308", "7376242AD320",
		}},

		// S.No 107 - WW 002 - B.Tech. IT - 22GE002
		{HallNo: "WW 002", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252IT378", "7376252IT387")
		}()},

		// S.No 108 - WW 003 - B.E. EC - 22GE002
		{HallNo: "WW 003", CourseCode: "22GE002", RegisterNos: []string{
			"7376231EC101", "7376231EC112",
			"7376231EC283", "7376231EC297",
			"7376231EC331", "7376231EC334",
		}},

		// S.No 109 - WW 003 - B.E. EC - 22GE002
		{HallNo: "WW 003", CourseCode: "22GE002", RegisterNos: []string{
			"7376241EC111", "7376241EC137",
			"7376241EC171",
		}},

		// S.No 110 - WW 003 - B.Tech. IT - 22GE002
		{HallNo: "WW 003", CourseCode: "22GE002", RegisterNos: []string{"7376252IT388"}},

		// S.No 111 - WW 003 - B.Tech. AD - 22GE002
		{HallNo: "WW 003", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD101", "7376252AD110")
		}()},

		// S.No 112 - WW 004 - B.E. EC - 22GE002
		{HallNo: "WW 004", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC132", "7376251EC141")
		}()},

		// S.No 113 - WW 004 - B.Tech. AD - 22GE002
		{HallNo: "WW 004", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD146", "7376252AD155")
		}()},

		// S.No 114 - WW 005 - B.E. EC - 22GE002
		{HallNo: "WW 005", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC142", "7376251EC151")
		}()},

		// S.No 115 - WW 005 - B.Tech. AD - 22GE002
		{HallNo: "WW 005", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD156", "7376252AD170")
		}()},

		// S.No 116 - WW 006 - B.E. EC - 22GE002
		{HallNo: "WW 006", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC172", "7376251EC181")
		}()},

		// S.No 117 - WW 006 - B.Tech. AD - 22GE002
		{HallNo: "WW 006", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD201", "7376252AD215")
		}()},

		// S.No 118 - WW 007 - B.E. EC - 22GE002
		{HallNo: "WW 007", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC182", "7376251EC191")
		}()},

		// S.No 119 - WW 007 - B.Tech. AD - 22GE002
		{HallNo: "WW 007", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD216", "7376252AD230")
		}()},

		// S.No 120 - WW 008 - B.E. EC - 22GE002
		{HallNo: "WW 008", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC192", "7376251EC201")
		}()},

		// S.No 121 - WW 008 - B.Tech. AD - 22GE002
		{HallNo: "WW 008", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD231", "7376252AD245")
		}()},

		// S.No 122 - WW 011 - B.E. EC - 22GE002
		{HallNo: "WW 011", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC257", "7376251EC266")
		}()},

		// S.No 123 - WW 011 - B.Tech. AD - 22GE002
		{HallNo: "WW 011", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD316", "7376252AD330")
		}()},

		// S.No 124 - WW 012 - B.E. EC - 22GE002
		{HallNo: "WW 012", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EC278", "7376251EC287")
		}()},

		// S.No 125 - WW 012 - B.Tech. AD - 22GE002
		{HallNo: "WW 012", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AD346", "7376252AD360")
		}()},

		// S.No 126 - WW 218 - B.Tech. BT - 22GE002
		{HallNo: "WW 218", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252BT107", "7376252BT116")
		}()},

		// S.No 127 - WW 218 - B.Tech. AL - 22GE002
		{HallNo: "WW 218", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AL171", "7376252AL185")
		}()},

		// S.No 128 - WW 219 - B.Tech. BT - 22GE002
		{HallNo: "WW 219", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252BT117", "7376252BT126")
		}()},

		// S.No 129 - WW 219 - B.Tech. AL - 22GE002
		{HallNo: "WW 219", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AL186", "7376252AL200")
		}()},

		// S.No 130 - WW 220 - B.Tech. BT - 22GE002
		{HallNo: "WW 220", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252BT127", "7376252BT136")
		}()},

		// S.No 131 - WW 220 - B.Tech. AL - 22GE002
		{HallNo: "WW 220", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AL201", "7376252AL210")
		}()},

		// S.No 132 - WW 221 - B.Tech. BT - 22GE002
		{HallNo: "WW 221", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252BT137", "7376252BT146")
		}()},

		// S.No 133 - WW 221 - B.Tech. AL - 22GE002
		{HallNo: "WW 221", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AL211", "7376252AL220")
		}()},

		// S.No 134 - WW 222 - B.Tech. BT - 22GE002
		{HallNo: "WW 222", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252BT147", "7376252BT171")
		}()},

		// S.No 135 - WW 222 - B.Tech. AL - 22GE002
		{HallNo: "WW 222", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252AL221", "7376252AL245")
		}()},

		// S.No 136 - WW 223 - B.E. EE - 22GE002
		{HallNo: "WW 223", CourseCode: "22GE002", RegisterNos: []string{
			"7376231EE104", "7376231EE159",
		}},

		// S.No 137 - WW 223 - B.E. EE - 22GE002
		{HallNo: "WW 223", CourseCode: "22GE002", RegisterNos: []string{
			"7376241EE147", "7376241EE157",
			"7376241EE193",
		}},

		// S.No 138 - WW 223 - B.E. EE - 22GE002
		{HallNo: "WW 223", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EE102", "7376251EE120")
		}()},

		// S.No 139 - WW 223 - B.Tech. BT - 22GE002
		{HallNo: "WW 223", CourseCode: "22GE002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252BT172", "7376252BT189")...)
			r = append(r, expandRange("7376252BT191", "7376252BT197")...)
			return r
		}()},

		// S.No 140 - WW 223 - B.Tech. AL - 22GE002
		{HallNo: "WW 223", CourseCode: "22GE002", RegisterNos: []string{"7376252AL246"}},

		// S.No 141 - WW 224 - B.E. EE - 22GE002
		{HallNo: "WW 224", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EE121", "7376251EE145")
		}()},

		// S.No 142 - WW 224 - B.Tech. BT - 22GE002
		{HallNo: "WW 224", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376252BT199", "7376252BT223")
		}()},

		// S.No 143 - WW 225 - B.E. EI - 22GE002
		{HallNo: "WW 225", CourseCode: "22GE002", RegisterNos: []string{"7376231EI159"}},

		// S.No 144 - WW 225 - B.E. EI - 22GE002
		{HallNo: "WW 225", CourseCode: "22GE002", RegisterNos: []string{"7376241EI104"}},

		// S.No 145 - WW 225 - B.E. EE - 22GE002
		{HallNo: "WW 225", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EE146", "7376251EE170")
		}()},

		// S.No 146 - WW 225 - B.E. EI - 22GE002
		{HallNo: "WW 225", CourseCode: "22GE002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EI101", "7376251EI109")...)
			r = append(r, expandRange("7376251EI111", "7376251EI123")...)
			return r
		}()},

		// S.No 147 - WW 225 - B.Tech. BT - 22GE002
		{HallNo: "WW 225", CourseCode: "22GE002", RegisterNos: []string{"7376252BT224"}},

		// S.No 148 - WW 226 - B.E. EE - 22GE002
		{HallNo: "WW 226", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EE171", "7376251EE195")
		}()},

		// S.No 149 - WW 226 - B.E. EI - 22GE002
		{HallNo: "WW 226", CourseCode: "22GE002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EI124", "7376251EI146")...)
			r = append(r, "7376251EI148", "7376251EI149")
			return r
		}()},

		// S.No 150 - WW 227 - B.E. ME - 22GE002
		{HallNo: "WW 227", CourseCode: "22GE002", RegisterNos: []string{"7376231ME103"}},

		// S.No 151 - WW 227 - B.E. MZ - 22GE002
		{HallNo: "WW 227", CourseCode: "22GE002", RegisterNos: []string{
			"7376231MZ106", "7376231MZ111",
			"7376231MZ135",
		}},

		// S.No 152 - WW 227 - B.E. ME - 22GE002
		{HallNo: "WW 227", CourseCode: "22GE002", RegisterNos: []string{"7376241ME146"}},

		// S.No 153 - WW 227 - B.E. EE - 22GE002
		{HallNo: "WW 227", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EE196", "7376251EE205")
		}()},

		// S.No 154 - WW 227 - B.E. EI - 22GE002
		{HallNo: "WW 227", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251EI150", "7376251EI162")
		}()},

		// S.No 155 - WW 227 - B.E. ME - 22GE002
		{HallNo: "WW 227", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251ME102", "7376251ME114")
		}()},

		// S.No 156 - WW 227 - B.E. MZ - 22GE002
		{HallNo: "WW 227", CourseCode: "22GE002", RegisterNos: func() []string {
			return expandRange("7376251MZ101", "7376251MZ109")
		}()},
	}
}

// PDF 4: 17__03_07_2026_FN.pdf
// Exam Date: 03-07-2026, Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData03July2026FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 301 - B.E. ME - 22HS201
		{HallNo: "AE 301", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251ME111", "7376251ME125")
		}()},

		// S.No 2 - AE 301 - B.E. MZ - 22HS201
		{HallNo: "AE 301", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251MZ112", "7376251MZ121")
		}()},

		// S.No 3 - AE 302 - B.E. CS - 22HS201
		{HallNo: "AE 302", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS234", "7376251CS248")
		}()},

		// S.No 4 - AE 302 - B.Tech. IT - 22HS201
		{HallNo: "AE 302", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT211", "7376252IT220")
		}()},

		// S.No 5 - EW 101 - B.E. CS - 22HS201
		{HallNo: "EW 101", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS249", "7376251CS263")
		}()},

		// S.No 6 - EW 101 - B.Tech. IT - 22HS201
		{HallNo: "EW 101", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT221", "7376252IT230")
		}()},

		// S.No 7 - EW 102 - B.E. CS - 22HS201
		{HallNo: "EW 102", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS264", "7376251CS278")
		}()},

		// S.No 8 - EW 102 - B.Tech. IT - 22HS201
		{HallNo: "EW 102", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT231", "7376252IT240")
		}()},

		// S.No 9 - EW 103 - B.E. CS - 22HS201
		{HallNo: "EW 103", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS294", "7376251CS308")
		}()},

		// S.No 10 - EW 103 - B.Tech. IT - 22HS201
		{HallNo: "EW 103", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT251", "7376252IT260")
		}()},

		// S.No 11 - EW 106 - B.E. CS - 22HS201
		{HallNo: "EW 106", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS384", "7376251CS398")
		}()},

		// S.No 12 - EW 106 - B.Tech. IT - 22HS201
		{HallNo: "EW 106", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT311", "7376252IT320")
		}()},

		// S.No 13 - EW 107 - B.E. CS - 22HS201
		{HallNo: "EW 107", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS279", "7376251CS293")
		}()},

		// S.No 14 - EW 107 - B.Tech. IT - 22HS201
		{HallNo: "EW 107", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT241", "7376252IT250")
		}()},

		// S.No 15 - EW 108 - B.E. CS - 22HS201
		{HallNo: "EW 108", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS309", "7376251CS323")
		}()},

		// S.No 16 - EW 108 - B.Tech. IT - 22HS201
		{HallNo: "EW 108", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT261", "7376252IT270")
		}()},

		// S.No 17 - EW 109 - B.E. CS - 22HS201
		{HallNo: "EW 109", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS324", "7376251CS338")
		}()},

		// S.No 18 - EW 109 - B.Tech. IT - 22HS201
		{HallNo: "EW 109", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT271", "7376252IT280")
		}()},

		// S.No 19 - EW 111 - B.E. CS - 22HS201
		{HallNo: "EW 111", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS339", "7376251CS353")
		}()},

		// S.No 20 - EW 111 - B.Tech. IT - 22HS201
		{HallNo: "EW 111", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT281", "7376252IT290")
		}()},

		// S.No 21 - EW 112 - B.E. CS - 22HS201
		{HallNo: "EW 112", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS354", "7376251CS368")
		}()},

		// S.No 22 - EW 112 - B.Tech. IT - 22HS201
		{HallNo: "EW 112", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT291", "7376252IT300")
		}()},

		// S.No 23 - EW 113 - B.E. EC - 22HS201
		{HallNo: "EW 113", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC135", "7376251EC144")
		}()},

		// S.No 24 - EW 113 - B.Tech. AD - 22HS201
		{HallNo: "EW 113", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD148", "7376252AD162")
		}()},

		// S.No 25 - EW 114 - B.E. EC - 22HS201
		{HallNo: "EW 114", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC195", "7376251EC204")
		}()},

		// S.No 26 - EW 114 - B.Tech. AD - 22HS201
		{HallNo: "EW 114", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD233", "7376252AD247")
		}()},

		// S.No 27 - EW 115 - B.E. EC - 22HS201
		{HallNo: "EW 115", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC240", "7376251EC249")
		}()},

		// S.No 28 - EW 115 - B.Tech. AD - 22HS201
		{HallNo: "EW 115", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD283", "7376252AD297")
		}()},

		// S.No 29 - EW 116 - B.E. EC - 22HS201
		{HallNo: "EW 116", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC250", "7376251EC259")
		}()},

		// S.No 30 - EW 116 - B.Tech. AD - 22HS201
		{HallNo: "EW 116", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD298", "7376252AD312")
		}()},

		// S.No 31 - EW 117 - B.E. EC - 22HS201
		{HallNo: "EW 117", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC271", "7376251EC280")
		}()},

		// S.No 32 - EW 117 - B.Tech. AD - 22HS201
		{HallNo: "EW 117", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD328", "7376252AD342")
		}()},

		// S.No 33 - EW 118 - B.E. EC - 22HS201
		{HallNo: "EW 118", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC291", "7376251EC300")
		}()},

		// S.No 34 - EW 118 - B.Tech. AD - 22HS201
		{HallNo: "EW 118", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD358", "7376252AD372")
		}()},

		// S.No 35 - EW 201 - B.E. CS - 22HS201
		{HallNo: "EW 201", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS414", "7376251CS428")
		}()},

		// S.No 36 - EW 201 - B.Tech. IT - 22HS201
		{HallNo: "EW 201", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT331", "7376252IT340")
		}()},

		// S.No 37 - EW 202 - B.E. CS - 22HS201
		{HallNo: "EW 202", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS444", "7376251CS458")
		}()},

		// S.No 38 - EW 202 - B.Tech. IT - 22HS201
		{HallNo: "EW 202", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT351", "7376252IT360")
		}()},

		// S.No 39 - EW 203 - B.E. EC - 22HS201
		{HallNo: "EW 203", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC145", "7376251EC154")
		}()},

		// S.No 40 - EW 203 - B.Tech. AD - 22HS201
		{HallNo: "EW 203", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD163", "7376252AD177")
		}()},

		// S.No 41 - EW 204 - B.E. EC - 22HS201
		{HallNo: "EW 204", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC175", "7376251EC184")
		}()},

		// S.No 42 - EW 204 - B.Tech. AD - 22HS201
		{HallNo: "EW 204", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD208", "7376252AD217")
		}()},

		// S.No 43 - EW 205 - B.E. EC - 22HS201
		{HallNo: "EW 205", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC205", "7376251EC214")
		}()},

		// S.No 44 - EW 205 - B.Tech. AD - 22HS201
		{HallNo: "EW 205", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD248", "7376252AD257")
		}()},

		// S.No 45 - EW 206 - B.E. EC - 22HS201
		{HallNo: "EW 206", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC215", "7376251EC239")
		}()},

		// S.No 46 - EW 206 - B.Tech. AD - 22HS201
		{HallNo: "EW 206", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD258", "7376252AD282")
		}()},

		// S.No 47 - EW 207 - B.E. CS - 22HS201
		{HallNo: "EW 207", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS369", "7376251CS383")
		}()},

		// S.No 48 - EW 207 - B.Tech. IT - 22HS201
		{HallNo: "EW 207", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT301", "7376252IT310")
		}()},

		// S.No 49 - EW 208 - B.E. CS - 22HS201
		{HallNo: "EW 208", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS399", "7376251CS413")
		}()},

		// S.No 50 - EW 208 - B.Tech. IT - 22HS201
		{HallNo: "EW 208", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT321", "7376252IT330")
		}()},

		// S.No 51 - EW 209 - B.E. CS - 22HS201
		{HallNo: "EW 209", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS429", "7376251CS443")
		}()},

		// S.No 52 - EW 209 - B.Tech. IT - 22HS201
		{HallNo: "EW 209", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT341", "7376252IT350")
		}()},

		// S.No 53 - EW 212 - B.E. EC - 22HS201
		{HallNo: "EW 212", CourseCode: "22HS201", RegisterNos: []string{
			"7376231EC331", "7376231EC334",
		}},

		// S.No 54 - EW 212 - B.E. EC - 22HS201
		{HallNo: "EW 212", CourseCode: "22HS201", RegisterNos: []string{"7376241EC111"}},

		// S.No 55 - EW 212 - B.Tech. AD - 22HS201
		{HallNo: "EW 212", CourseCode: "22HS201", RegisterNos: []string{
			"7376242AD189", "7376242AD320",
		}},

		// S.No 56 - EW 212 - B.E. CS - 22HS201
		{HallNo: "EW 212", CourseCode: "22HS201", RegisterNos: []string{"7376251CS479"}},

		// S.No 57 - EW 212 - B.E. EC - 22HS201
		{HallNo: "EW 212", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC101", "7376251EC114")
		}()},

		// S.No 58 - EW 212 - B.Tech. IT - 22HS201
		{HallNo: "EW 212", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT381", "7376252IT388")
		}()},

		// S.No 59 - EW 212 - B.Tech. AD - 22HS201
		{HallNo: "EW 212", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD101", "7376252AD122")
		}()},

		// S.No 60 - EW 213 - B.Tech. AL - 22HS201
		{HallNo: "EW 213", CourseCode: "22HS201", RegisterNos: []string{"7376242AL197"}},

		// S.No 61 - EW 213 - B.E. EC - 22HS201
		{HallNo: "EW 213", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC301", "7376251EC310")
		}()},

		// S.No 62 - EW 213 - B.Tech. AD - 22HS201
		{HallNo: "EW 213", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD373", "7376252AD381")
		}()},

		// S.No 63 - EW 213 - B.Tech. AL - 22HS201
		{HallNo: "EW 213", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL101", "7376252AL105")
		}()},

		// S.No 64 - EW 214 - B.E. EC - 22HS201
		{HallNo: "EW 214", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC311", "7376251EC320")
		}()},

		// S.No 65 - EW 214 - B.Tech. AL - 22HS201
		{HallNo: "EW 214", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL106", "7376252AL120")
		}()},

		// S.No 66 - EW 215 - B.E. EC - 22HS201
		{HallNo: "EW 215", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC321", "7376251EC330")
		}()},

		// S.No 67 - EW 215 - B.Tech. AL - 22HS201
		{HallNo: "EW 215", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL121", "7376252AL135")
		}()},

		// S.No 68 - EW 218 - B.Tech. BT - 22HS201
		{HallNo: "EW 218", CourseCode: "22HS201", RegisterNos: []string{"7376232BT115"}},

		// S.No 69 - EW 218 - B.E. EC - 22HS201
		{HallNo: "EW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC331", "7376251EC352")
		}()},

		// S.No 70 - EW 218 - B.Tech. BT - 22HS201
		{HallNo: "EW 218", CourseCode: "22HS201", RegisterNos: []string{
			"7376252BT102", "7376252BT103",
		}},

		// S.No 71 - EW 218 - B.Tech. AL - 22HS201
		{HallNo: "EW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL136", "7376252AL160")
		}()},

		// S.No 72 - MECH DH - B.E. CS - 22HS201
		{HallNo: "MECH DH", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS114", "7376251CS128")...)
			r = append(r, expandRange("7376251CS130", "7376251CS168")...)
			r = append(r, expandRange("7376251CS170", "7376251CS187")...)
			return r
		}()},

		// S.No 73 - MECH DH - B.Tech. IT - 22HS201
		{HallNo: "MECH DH", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT109", "7376252IT180")
		}()},

		// S.No 74 - MH 302 - B.E. CS - 22HS201
		{HallNo: "MH 302", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS188", "7376251CS202")
		}()},

		// S.No 75 - MH 302 - B.Tech. IT - 22HS201
		{HallNo: "MH 302", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT181", "7376252IT190")
		}()},

		// S.No 76 - MH 303 - B.E. CS - 22HS201
		{HallNo: "MH 303", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS203", "7376251CS217")
		}()},

		// S.No 77 - MH 303 - B.Tech. IT - 22HS201
		{HallNo: "MH 303", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT191", "7376252IT200")
		}()},

		// S.No 78 - MH 305 - B.E. CS - 22HS201
		{HallNo: "MH 305", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS218", "7376251CS228")...)
			r = append(r, expandRange("7376251CS230", "7376251CS233")...)
			return r
		}()},

		// S.No 79 - MH 305 - B.Tech. IT - 22HS201
		{HallNo: "MH 305", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT201", "7376252IT210")
		}()},

		// S.No 80 - MH 306 - B.E. CS - 22HS201
		{HallNo: "MH 306", CourseCode: "22HS201", RegisterNos: []string{"7376231CS288"}},

		// S.No 81 - MH 306 - B.Tech. IT - 22HS201
		{HallNo: "MH 306", CourseCode: "22HS201", RegisterNos: []string{"7376232IT282"}},

		// S.No 82 - MH 306 - B.E. CS - 22HS201
		{HallNo: "MH 306", CourseCode: "22HS201", RegisterNos: []string{"7376241CS103"}},

		// S.No 83 - MH 306 - B.Tech. IT - 22HS201
		{HallNo: "MH 306", CourseCode: "22HS201", RegisterNos: []string{
			"7376242IT146", "7376242IT184",
		}},

		// S.No 84 - MH 306 - B.E. CS - 22HS201
		{HallNo: "MH 306", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS101", "7376251CS113")
		}()},

		// S.No 85 - MH 306 - B.Tech. IT - 22HS201
		{HallNo: "MH 306", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT102", "7376252IT108")
		}()},

		// S.No 86 - SF B01 - B.E. ME - 22HS201
		{HallNo: "SF B01", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251ME126", "7376251ME145")
		}()},

		// S.No 87 - SF B01 - B.E. MZ - 22HS201
		{HallNo: "SF B01", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251MZ122", "7376251MZ127")...)
			r = append(r, expandRange("7376251MZ129", "7376251MZ131")...)
			r = append(r, expandRange("7376251MZ133", "7376251MZ136")...)
			r = append(r, expandRange("7376251MZ139", "7376251MZ145")...)
			return r
		}()},

		// S.No 88 - SF B02 - B.Tech. CB - 22CB204
		{HallNo: "SF B02", CourseCode: "22CB204", RegisterNos: []string{
			"7376232CB103", "7376232CB106",
			"7376232CB110", "7376232CB111",
		}},

		// S.No 89 - SF B02 - B.Tech. AG - 22HS201
		{HallNo: "SF B02", CourseCode: "22HS201", RegisterNos: []string{"7376232AG113"}},

		// S.No 90 - SF B02 - B.E. ME - 22HS201
		{HallNo: "SF B02", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251ME146", "7376251ME160")
		}()},

		// S.No 91 - SF B02 - B.E. MZ - 22HS201
		{HallNo: "SF B02", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376251MZ146", "7376251MZ147")
			r = append(r, expandRange("7376251MZ149", "7376251MZ162")...)
			return r
		}()},

		// S.No 92 - SF B02 - B.Tech. AG - 22HS201
		{HallNo: "SF B02", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AG101", "7376252AG104")
		}()},

		// S.No 93 - SF B03 - B.E. SE - 22HS201
		{HallNo: "SF B03", CourseCode: "22HS201", RegisterNos: []string{"7376231SE144"}},

		// S.No 94 - SF B03 - B.Tech. CB - 22CB204
		{HallNo: "SF B03", CourseCode: "22CB204", RegisterNos: []string{
			"7376232CB120", "7376232CB123",
			"7376232CB133", "7376232CB145",
			"7376232CB146",
		}},

		// S.No 95 - SF B03 - B.Tech. CT - 22HS201
		{HallNo: "SF B03", CourseCode: "22HS201", RegisterNos: []string{"7376232CT122"}},

		// S.No 96 - SF B03 - B.Tech. CB - 22CB204
		{HallNo: "SF B03", CourseCode: "22CB204", RegisterNos: []string{
			"7376242CB116", "7376242CB118",
			"7376242CB119", "7376242CB133",
			"7376242CB134", "7376242CB139",
			"7376242CB147", "7376242CB154",
			"7376242CB157",
		}},

		// S.No 97 - SF B03 - B.Tech. AG - 22HS201
		{HallNo: "SF B03", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252AG105", "7376252AG113")...)
			r = append(r, expandRange("7376252AG115", "7376252AG127")...)
			return r
		}()},

		// S.No 98 - WW 002 - B.E. CS - 22HS201
		{HallNo: "WW 002", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS459", "7376251CS468")
		}()},

		// S.No 99 - WW 002 - B.Tech. IT - 22HS201
		{HallNo: "WW 002", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT361", "7376252IT370")
		}()},

		// S.No 100 - WW 003 - B.E. CS - 22HS201
		{HallNo: "WW 003", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS469", "7376251CS478")
		}()},

		// S.No 101 - WW 003 - B.Tech. IT - 22HS201
		{HallNo: "WW 003", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT371", "7376252IT380")
		}()},

		// S.No 102 - WW 004 - B.E. EC - 22HS201
		{HallNo: "WW 004", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC115", "7376251EC124")
		}()},

		// S.No 103 - WW 004 - B.Tech. AD - 22HS201
		{HallNo: "WW 004", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD123", "7376252AD132")
		}()},

		// S.No 104 - WW 005 - B.E. EC - 22HS201
		{HallNo: "WW 005", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC125", "7376251EC134")
		}()},

		// S.No 105 - WW 005 - B.Tech. AD - 22HS201
		{HallNo: "WW 005", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD133", "7376252AD147")
		}()},

		// S.No 106 - WW 006 - B.E. EC - 22HS201
		{HallNo: "WW 006", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC155", "7376251EC164")
		}()},

		// S.No 107 - WW 006 - B.Tech. AD - 22HS201
		{HallNo: "WW 006", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD178", "7376252AD192")
		}()},

		// S.No 108 - WW 007 - B.E. EC - 22HS201
		{HallNo: "WW 007", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC165", "7376251EC174")
		}()},

		// S.No 109 - WW 007 - B.Tech. AD - 22HS201
		{HallNo: "WW 007", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD193", "7376252AD207")
		}()},

		// S.No 110 - WW 008 - B.E. EC - 22HS201
		{HallNo: "WW 008", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC185", "7376251EC194")
		}()},

		// S.No 111 - WW 008 - B.Tech. AD - 22HS201
		{HallNo: "WW 008", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD218", "7376252AD232")
		}()},

		// S.No 112 - WW 011 - B.E. EC - 22HS201
		{HallNo: "WW 011", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC260", "7376251EC269")
		}()},

		// S.No 113 - WW 011 - B.Tech. AD - 22HS201
		{HallNo: "WW 011", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD313", "7376252AD327")
		}()},

		// S.No 114 - WW 012 - B.E. EC - 22HS201
		{HallNo: "WW 012", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC281", "7376251EC290")
		}()},

		// S.No 115 - WW 012 - B.Tech. AD - 22HS201
		{HallNo: "WW 012", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD343", "7376252AD357")
		}()},

		// S.No 116 - WW 218 - B.Tech. BT - 22HS201
		{HallNo: "WW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT104", "7376252BT113")
		}()},

		// S.No 117 - WW 218 - B.Tech. AL - 22HS201
		{HallNo: "WW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL161", "7376252AL175")
		}()},

		// S.No 118 - WW 219 - B.Tech. BT - 22HS201
		{HallNo: "WW 219", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT114", "7376252BT123")
		}()},

		// S.No 119 - WW 219 - B.Tech. AL - 22HS201
		{HallNo: "WW 219", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL176", "7376252AL190")
		}()},

		// S.No 120 - WW 220 - B.Tech. BT - 22HS201
		{HallNo: "WW 220", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT124", "7376252BT133")
		}()},

		// S.No 121 - WW 220 - B.Tech. AL - 22HS201
		{HallNo: "WW 220", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL191", "7376252AL200")
		}()},

		// S.No 122 - WW 221 - B.Tech. BT - 22HS201
		{HallNo: "WW 221", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT134", "7376252BT143")
		}()},

		// S.No 123 - WW 221 - B.Tech. AL - 22HS201
		{HallNo: "WW 221", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL201", "7376252AL210")
		}()},

		// S.No 124 - WW 222 - B.Tech. BT - 22HS201
		{HallNo: "WW 222", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT144", "7376252BT168")
		}()},

		// S.No 125 - WW 222 - B.Tech. AL - 22HS201
		{HallNo: "WW 222", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL211", "7376252AL235")
		}()},

		// S.No 126 - WW 223 - B.E. EE - 22HS201
		{HallNo: "WW 223", CourseCode: "22HS201", RegisterNos: []string{"7376241EE193"}},

		// S.No 127 - WW 223 - B.E. EE - 22HS201
		{HallNo: "WW 223", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EE102", "7376251EE114")
		}()},

		// S.No 128 - WW 223 - B.Tech. BT - 22HS201
		{HallNo: "WW 223", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252BT169", "7376252BT189")...)
			r = append(r, expandRange("7376252BT191", "7376252BT194")...)
			return r
		}()},

		// S.No 129 - WW 223 - B.Tech. AL - 22HS201
		{HallNo: "WW 223", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL236", "7376252AL246")
		}()},

		// S.No 130 - WW 224 - B.E. EE - 22HS201
		{HallNo: "WW 224", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EE115", "7376251EE139")
		}()},

		// S.No 131 - WW 224 - B.Tech. BT - 22HS201
		{HallNo: "WW 224", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252BT195", "7376252BT197")...)
			r = append(r, expandRange("7376252BT199", "7376252BT220")...)
			return r
		}()},

		// S.No 132 - WW 225 - B.E. EE - 22HS201
		{HallNo: "WW 225", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EE140", "7376251EE164")
		}()},

		// S.No 133 - WW 225 - B.E. EI - 22HS201
		{HallNo: "WW 225", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EI101", "7376251EI109")...)
			r = append(r, expandRange("7376251EI111", "7376251EI122")...)
			return r
		}()},

		// S.No 134 - WW 225 - B.Tech. BT - 22HS201
		{HallNo: "WW 225", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT221", "7376252BT224")
		}()},

		// S.No 135 - WW 226 - B.E. EE - 22HS201
		{HallNo: "WW 226", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EE165", "7376251EE189")
		}()},

		// S.No 136 - WW 226 - B.E. EI - 22HS201
		{HallNo: "WW 226", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EI123", "7376251EI146")...)
			r = append(r, "7376251EI148")
			return r
		}()},

		// S.No 137 - WW 227 - B.E. EE - 22HS201
		{HallNo: "WW 227", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EE190", "7376251EE205")
		}()},

		// S.No 138 - WW 227 - B.E. EI - 22HS201
		{HallNo: "WW 227", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EI149", "7376251EI162")
		}()},

		// S.No 139 - WW 227 - B.E. ME - 22HS201
		{HallNo: "WW 227", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251ME102", "7376251ME110")
		}()},

		// S.No 140 - WW 227 - B.E. MZ - 22HS201
		{HallNo: "WW 227", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251MZ101", "7376251MZ111")
		}()},
	}
}


// LookupHall returns the hall number for a given register number and course code.
func LookupHall(registerNo, courseCode string) (string, bool) {
	registerNo = strings.TrimSpace(strings.ToUpper(registerNo))
	courseCode = strings.TrimSpace(strings.ToUpper(courseCode))

	var allRecords []models.SeatingRecord

	allRecords = append(allRecords, buildSeatingData13June2026AN()...)
	allRecords = append(allRecords, buildSeatingData13June2026FN()...)
	allRecords = append(allRecords, buildSeatingData15June2026FN()...)
	allRecords = append(allRecords, buildSeatingData15June2026AN()...)

	allRecords = append(allRecords, buildSeatingData09June2026AN()...)
	allRecords = append(allRecords, buildSeatingData08June2026FN()...)
	allRecords = append(allRecords, buildSeatingData07June2026AN()...)
	allRecords = append(allRecords, buildSeatingData06June2026FN()...)

	allRecords = append(allRecords, buildSeatingData22June2026FN()...)
	allRecords = append(allRecords, buildSeatingData22June2026AN()...)
	allRecords = append(allRecords, buildSeatingData24June2026FN()...)
	allRecords = append(allRecords, buildSeatingData24June2026AN()...)

	allRecords = append(allRecords, buildSeatingData29June2026FN()...)
	allRecords = append(allRecords, buildSeatingData29June2026AN()...)
	allRecords = append(allRecords, buildSeatingData01July2026FN()...)
	allRecords = append(allRecords, buildSeatingData03July2026FN()...)

	for _, record := range allRecords {
		if strings.ToUpper(record.CourseCode) != courseCode {
			continue
		}

		for _, reg := range record.RegisterNos {
			if strings.ToUpper(reg) == registerNo {
				return record.HallNo, true
			}
		}
	}

	return "", false
}

// LookupAllByRegister returns all exam sessions for a given register number.
func LookupAllByRegister(registerNo string) []models.ExamSession {
	registerNo = strings.TrimSpace(strings.ToUpper(registerNo))

	var allRecords []models.SeatingRecord
	allRecords = append(allRecords, buildSeatingData13June2026AN()...)
	allRecords = append(allRecords, buildSeatingData13June2026FN()...)
	allRecords = append(allRecords, buildSeatingData15June2026FN()...)
	allRecords = append(allRecords, buildSeatingData15June2026AN()...)
	allRecords = append(allRecords, buildSeatingData09June2026AN()...)
	allRecords = append(allRecords, buildSeatingData08June2026FN()...)
	allRecords = append(allRecords, buildSeatingData07June2026AN()...)
	allRecords = append(allRecords, buildSeatingData06June2026FN()...)
	allRecords = append(allRecords, buildSeatingData22June2026FN()...)
	allRecords = append(allRecords, buildSeatingData22June2026AN()...)
	allRecords = append(allRecords, buildSeatingData24June2026FN()...)
	allRecords = append(allRecords, buildSeatingData24June2026AN()...)
	allRecords = append(allRecords, buildSeatingData29June2026FN()...)
	allRecords = append(allRecords, buildSeatingData29June2026AN()...)
	allRecords = append(allRecords, buildSeatingData01July2026FN()...)
	allRecords = append(allRecords, buildSeatingData03July2026FN()...)

	var results []models.ExamSession
	seen := make(map[string]bool) // deduplicate hall+course combos

	for _, record := range allRecords {
		for _, reg := range record.RegisterNos {
			if strings.ToUpper(reg) == registerNo {
				key := record.HallNo + "|" + record.CourseCode
				if !seen[key] {
					seen[key] = true
					results = append(results, models.ExamSession{
						HallNo:     record.HallNo,
						CourseCode: record.CourseCode,
					})
				}
				break
			}
		}
	}

	return results
}