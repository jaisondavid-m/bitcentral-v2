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

// buildSeatingData11FN returns all seating records from the 11-05-2026 FN exam
// Exam Date: 11-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData11FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 302 - B.E. CS - 22CS601
		{HallNo: "AE 302", CourseCode: "22CS601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS153", "7376231CS166")...)
			r = append(r, "7376231CS168")
			return r
		}()},

		// S.No 2 - AE 302 - B.E. EC - 22EC601
		{HallNo: "AE 302", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC128", "7376231EC137")},

		// S.No 3 - EW 101 - B.E. CS - 22CS601
		{HallNo: "EW 101", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS169", "7376231CS183")},

		// S.No 4 - EW 101 - B.E. EC - 22EC601
		{HallNo: "EW 101", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC138", "7376231EC147")},

		// S.No 5 - EW 102 - B.E. CS - 22CS601
		{HallNo: "EW 102", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS184", "7376231CS198")},

		// S.No 6 - EW 102 - B.E. EC - 22EC601
		{HallNo: "EW 102", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC148", "7376231EC157")},

		// S.No 7 - EW 103 - B.E. CS - 22CS601
		{HallNo: "EW 103", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS244", "7376231CS258")},

		// S.No 8 - EW 103 - B.E. EC - 22EC601
		{HallNo: "EW 103", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC188", "7376231EC197")},

		// S.No 9 - EW 104 - B.E. CS - 22CS601
		{HallNo: "EW 104", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS337", "7376231CS351")},

		// S.No 10 - EW 104 - B.E. EC - 22EC601
		{HallNo: "EW 104", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC248", "7376231EC257")},

		// S.No 11 - EW 105 - B.E. CS - 22CS601
		{HallNo: "EW 105", CourseCode: "22CS601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS352", "7376231CS354")...)
			r = append(r, expandRange("7376241CS501", "7376241CS512")...)
			return r
		}()},

		// S.No 12 - EW 105 - B.E. EC - 22EC601
		{HallNo: "EW 105", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC258", "7376231EC267")},

		// S.No 13 - EW 106 - 22EC601
		{HallNo: "EW 106", CourseCode: "22EC601", RegisterNos: expandRange("7376241EC505", "7376241EC514")},

		// S.No 14 - EW 106 - B.Tech. AD - 22AI601
		{HallNo: "EW 106", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD195", "7376232AD209")},

		// S.No 15 - EW 107 - B.E. CS - 22CS601
		{HallNo: "EW 107", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS214", "7376231CS228")},

		// S.No 16 - EW 107 - B.E. EC - 22EC601
		{HallNo: "EW 107", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC168", "7376231EC177")},

		// S.No 17 - EW 108 - B.E. CS - 22CS601
		{HallNo: "EW 108", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS259", "7376231CS273")},

		// S.No 18 - EW 108 - B.E. EC - 22EC601
		{HallNo: "EW 108", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC198", "7376231EC207")},

		// S.No 19 - EW 109 - B.E. CS - 22CS601
		{HallNo: "EW 109", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS290", "7376231CS304")},

		// S.No 20 - EW 109 - B.E. EC - 22EC601
		{HallNo: "EW 109", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC218", "7376231EC227")},

		// S.No 21 - EW 111 - B.E. CS - 22CS601
		{HallNo: "EW 111", CourseCode: "22CS601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS320", "7376231CS321")
			r = append(r, expandRange("7376231CS323", "7376231CS326")...)
			r = append(r, expandRange("7376231CS328", "7376231CS336")...)
			return r
		}()},

		// S.No 22 - EW 111 - B.E. EC - 22EC601
		{HallNo: "EW 111", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC238", "7376231EC247")},

		// S.No 23 - EW 112 - B.E. CS - 22CS601
		{HallNo: "EW 112", CourseCode: "22CS601", RegisterNos: []string{
			"7376241CS513", "7376241CS514", "7376241CS515", "7376241CS516",
			"7376241CS518", "7376241CS519",
		}},

		// S.No 24 - EW 112 - B.E. EC - 22EC601
		{HallNo: "EW 112", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC268", "7376231EC277")},

		// S.No 25 - EW 112 - B.Tech. AD - 22AI601
		{HallNo: "EW 112", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD101", "7376232AD109")},

		// S.No 26 - EW 113 - B.Tech. IT - 22IT601
		{HallNo: "EW 113", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT238", "7376232IT247")},

		// S.No 27 - EW 113 - B.Tech. AL - 22AM601
		{HallNo: "EW 113", CourseCode: "22AM601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL208", "7376232AL221")...)
			r = append(r, "7376242AL501")
			return r
		}()},

		// S.No 28 - EW 114 - B.E. CD - 22CD601
		{HallNo: "EW 114", CourseCode: "22CD601", RegisterNos: []string{
			"7376221CD114", "7376221CD126", "7376221CD153",
		}},

		// S.No 29 - EW 114 - B.E. ME - 22ME601
		{HallNo: "EW 114", CourseCode: "22ME601", RegisterNos: expandRange("7376241ME501", "7376241ME505")},

		// S.No 30 - EW 114 - B.E. CD - 22CD601
		{HallNo: "EW 114", CourseCode: "22CD601", RegisterNos: expandRange("7376231CD102", "7376231CD108")},

		// S.No 31 - EW 114 - B.Tech. BT - 22BT601
		{HallNo: "EW 114", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT101", "7376232BT110")},

		// S.No 32 - EW 115 - B.E. CD - 22CD601
		{HallNo: "EW 115", CourseCode: "22CD601", RegisterNos: expandRange("7376231CD144", "7376231CD158")},

		// S.No 33 - EW 115 - B.Tech. BT - 22BT601
		{HallNo: "EW 115", CourseCode: "22BT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT147", "7376232BT149")...)
			r = append(r, expandRange("7376232BT151", "7376232BT157")...)
			return r
		}()},

		// S.No 34 - EW 116 - B.E. CD - 22CD601
		{HallNo: "EW 116", CourseCode: "22CD601", RegisterNos: []string{"7376231CD503"}},

		// S.No 35 - EW 116 - 22CD601
		{HallNo: "EW 116", CourseCode: "22CD601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CD159", "7376231CD162")...)
			r = append(r, expandRange("7376241CD501", "7376241CD503")...)
			return r
		}()},

		// S.No 36 - EW 116 - B.Tech. BT - 22BT601
		{HallNo: "EW 116", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT158", "7376232BT167")},

		// S.No 37 - EW 116 - B.Tech. CT - 22CT601
		{HallNo: "EW 116", CourseCode: "22CT601", RegisterNos: expandRange("7376232CT101", "7376232CT107")},

		// S.No 38 - EW 117 - B.Tech. BT - 22BT601
		{HallNo: "EW 117", CourseCode: "22BT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT178", "7376232BT185")...)
			r = append(r, "7376232BT187", "7376232BT188")
			return r
		}()},

		// S.No 39 - EW 117 - B.Tech. CT - 22CT601
		{HallNo: "EW 117", CourseCode: "22CT601", RegisterNos: expandRange("7376232CT123", "7376232CT137")},

		// S.No 40 - EW 118 - B.E. MZ - 22MC601
		{HallNo: "EW 118", CourseCode: "22MC601", RegisterNos: []string{"7376231MZ101", "7376231MZ102"}},

		// S.No 41 - EW 118 - B.Tech. BT - 22BT601
		{HallNo: "EW 118", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT199", "7376232BT208")},

		// S.No 42 - EW 118 - B.Tech. CT - 22CT601
		{HallNo: "EW 118", CourseCode: "22CT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CT153", "7376232CT162")...)
			r = append(r, expandRange("7376242CT501", "7376242CT503")...)
			return r
		}()},

		// S.No 43 - EW 201 - B.Tech. IT - 22IT601
		{HallNo: "EW 201", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT111", "7376232IT120")},

		// S.No 44 - EW 201 - B.Tech. AD - 22AI601
		{HallNo: "EW 201", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD240", "7376232AD254")},

		// S.No 45 - EW 202 - B.Tech. IT - 22IT601
		{HallNo: "EW 202", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT131", "7376232IT140")},

		// S.No 46 - EW 202 - B.Tech. AD - 22AI601
		{HallNo: "EW 202", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD270", "7376232AD284")},

		// S.No 47 - EW 203 - B.E. ME - 22ME601
		{HallNo: "EW 203", CourseCode: "22ME601", RegisterNos: []string{
			"7376221ME111", "7376221ME138", "7376221ME154",
		}},

		// S.No 48 - EW 203 - 22ME601
		{HallNo: "EW 203", CourseCode: "22ME601", RegisterNos: expandRange("7376231ME101", "7376231ME106")},

		// S.No 49 - EW 203 - B.Tech. IT - 22IT601
		{HallNo: "EW 203", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT248", "7376232IT257")},

		// S.No 50 - EW 203 - B.Tech. AL - 22AM601
		{HallNo: "EW 203", CourseCode: "22AM601", RegisterNos: expandRange("7376242AL502", "7376242AL507")},

		// S.No 51 - EW 204 - B.E. ME - 22ME601
		{HallNo: "EW 204", CourseCode: "22ME601", RegisterNos: expandRange("7376231ME137", "7376231ME146")},

		// S.No 52 - EW 204 - B.Tech. IT - 22IT601
		{HallNo: "EW 204", CourseCode: "22IT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT278", "7376232IT281")...)
			r = append(r, expandRange("7376232IT283", "7376232IT286")...)
			r = append(r, "7376242IT501", "7376242IT502")
			return r
		}()},

		// S.No 53 - EW 205 - B.E. CD - 22CD601
		{HallNo: "EW 205", CourseCode: "22CD601", RegisterNos: expandRange("7376231CD109", "7376231CD118")},

		// S.No 54 - EW 205 - B.Tech. BT - 22BT601
		{HallNo: "EW 205", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT111", "7376232BT120")},

		// S.No 55 - EW 206 - B.E. CD - 22CD601
		{HallNo: "EW 206", CourseCode: "22CD601", RegisterNos: expandRange("7376231CD119", "7376231CD143")},

		// S.No 56 - EW 206 - B.Tech. BT - 22BT601
		{HallNo: "EW 206", CourseCode: "22BT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT121", "7376232BT127")...)
			r = append(r, expandRange("7376232BT129", "7376232BT146")...)
			return r
		}()},

		// S.No 57 - EW 207 - B.E. EC - 22EC601
		{HallNo: "EW 207", CourseCode: "22EC601", RegisterNos: []string{
			"7376231EC504", "7376231EC506", "7376231EC507", "7376231EC514",
		}},

		// S.No 58 - EW 207 - 22EC601
		{HallNo: "EW 207", CourseCode: "22EC601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC333", "7376231EC334")
			r = append(r, expandRange("7376241EC501", "7376241EC504")...)
			return r
		}()},

		// S.No 59 - EW 207 - B.Tech. AD - 22AI601
		{HallNo: "EW 207", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD180", "7376232AD194")},

		// S.No 60 - EW 208 - B.Tech. IT - 22IT601
		{HallNo: "EW 208", CourseCode: "22IT601", RegisterNos: []string{"7376212IT105", "7376222IT110"}},

		// S.No 61 - EW 208 - B.E. EC - 22EC601
		{HallNo: "EW 208", CourseCode: "22EC601", RegisterNos: expandRange("7376241EC515", "7376241EC522")},

		// S.No 62 - EW 208 - B.Tech. AD - 22AI601
		{HallNo: "EW 208", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD210", "7376232AD224")},

		// S.No 63 - EW 209 - B.Tech. IT - 22IT601
		{HallNo: "EW 209", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT121", "7376232IT130")},

		// S.No 64 - EW 209 - B.Tech. AD - 22AI601
		{HallNo: "EW 209", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD255", "7376232AD269")},

		// S.No 65 - EW 210 - B.Tech. IT - 22IT601
		{HallNo: "EW 210", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT151", "7376232IT160")},

		// S.No 66 - EW 210 - B.Tech. AL - 22AM601
		{HallNo: "EW 210", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL102", "7376232AL111")},

		// S.No 67 - EW 211 - B.Tech. IT - 22IT601
		{HallNo: "EW 211", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT192", "7376232IT201")},

		// S.No 68 - EW 211 - B.Tech. AL - 22AM601
		{HallNo: "EW 211", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL157", "7376232AL166")},

		// S.No 69 - EW 212 - B.Tech. IT - 22IT601
		{HallNo: "EW 212", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT202", "7376232IT226")},

		// S.No 70 - EW 212 - B.Tech. AL - 22AM601
		{HallNo: "EW 212", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL167", "7376232AL191")},

		// S.No 71 - EW 213 - B.Tech. CB - 22CB601
		{HallNo: "EW 213", CourseCode: "22CB601", RegisterNos: []string{
			"7376222CB121", "7376222CB150", "7376222CB153",
		}},

		// S.No 72 - EW 213 - B.E. MZ - 22MC601
		{HallNo: "EW 213", CourseCode: "22MC601", RegisterNos: expandRange("7376231MZ103", "7376231MZ117")},

		// S.No 73 - EW 213 - B.Tech. BT - 22BT601
		{HallNo: "EW 213", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT209", "7376232BT215")},

		// S.No 74 - EW 214 - B.E. MZ - 22MC601
		{HallNo: "EW 214", CourseCode: "22MC601", RegisterNos: expandRange("7376231MZ118", "7376231MZ132")},

		// S.No 75 - EW 214 - B.Tech. CB - 22CB601
		{HallNo: "EW 214", CourseCode: "22CB601", RegisterNos: expandRange("7376232CB101", "7376232CB110")},

		// S.No 76 - EW 215 - B.E. MZ - 22MC601
		{HallNo: "EW 215", CourseCode: "22MC601", RegisterNos: expandRange("7376231MZ133", "7376231MZ147")},

		// S.No 77 - EW 215 - B.Tech. CB - 22CB601
		{HallNo: "EW 215", CourseCode: "22CB601", RegisterNos: expandRange("7376232CB111", "7376232CB120")},

		// S.No 78 - EW 216 - B.E. MZ - 22MC601
		{HallNo: "EW 216", CourseCode: "22MC601", RegisterNos: expandRange("7376231MZ148", "7376231MZ157")},

		// S.No 79 - EW 216 - B.Tech. CB - 22CB601
		{HallNo: "EW 216", CourseCode: "22CB601", RegisterNos: expandRange("7376232CB121", "7376232CB130")},

		// S.No 80 - EW 217 - B.Tech. AG - 22AG601
		{HallNo: "EW 217", CourseCode: "22AG601", RegisterNos: []string{"7376222AG120", "7376222AG158"}},

		// S.No 81 - EW 217 - B.E. MZ - 22MC601
		{HallNo: "EW 217", CourseCode: "22MC601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231MZ158")
			r = append(r, expandRange("7376241MZ501", "7376241MZ506")...)
			return r
		}()},

		// S.No 82 - EW 217 - B.Tech. CB - 22CB601
		{HallNo: "EW 217", CourseCode: "22CB601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB131", "7376232CB137")...)
			r = append(r, expandRange("7376232CB139", "7376232CB141")...)
			return r
		}()},

		// S.No 83 - EW 217 - B.Tech. AG - 22AG601
		{HallNo: "EW 217", CourseCode: "22AG601", RegisterNos: []string{"7376232AG102"}},

		// S.No 84 - EW 218 - B.Tech. CB - 22CB601
		{HallNo: "EW 218", CourseCode: "22CB601", RegisterNos: []string{"7376232CB501", "7376232CB504"}},

		// S.No 85 - EW 218 - 22CB601
		{HallNo: "EW 218", CourseCode: "22CB601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB142", "7376232CB157")...)
			r = append(r, expandRange("7376232CB159", "7376232CB163")...)
			r = append(r, "7376242CB502", "7376242CB503")
			return r
		}()},

		// S.No 86 - EW 218 - B.Tech. AG - 22AG601
		{HallNo: "EW 218", CourseCode: "22AG601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG103", "7376232AG109")...)
			r = append(r, expandRange("7376232AG111", "7376232AG128")...)
			return r
		}()},

		// S.No 87 - MH 301 - B.E. CS - 22CS601
		{HallNo: "MH 301", CourseCode: "22CS601", RegisterNos: []string{
			"7376221CS109", "7376221CS114", "7376221CS118", "7376221CS140",
			"7376221CS196", "7376221CS240", "7376221CS275", "7376221CS288",
		}},

		// S.No 88 - MH 301 - B.E. EC - 22EC601
		{HallNo: "MH 301", CourseCode: "22EC601", RegisterNos: []string{
			"7376221EC107", "7376221EC116", "7376221EC129", "7376221EC139",
			"7376221EC149", "7376221EC151", "7376221EC192", "7376221EC226",
			"7376221EC244", "7376221EC273",
		}},

		// S.No 89 - MH 301 - B.E. CS - 22CS601
		{HallNo: "MH 301", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS101", "7376231CS107")},

		// S.No 90 - MH 302 - B.E. EC - 22EC601
		{HallNo: "MH 302", CourseCode: "22EC601", RegisterNos: []string{
			"7376221EC290", "7376221EC307", "7376221EC337",
		}},

		// S.No 91 - MH 302 - B.E. CS - 22CS601
		{HallNo: "MH 302", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS108", "7376231CS122")},

		// S.No 92 - MH 302 - B.E. EC - 22EC601
		{HallNo: "MH 302", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC101", "7376231EC107")},

		// S.No 93 - MH 303 - B.E. CS - 22CS601
		{HallNo: "MH 303", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS123", "7376231CS137")},

		// S.No 94 - MH 303 - B.E. EC - 22EC601
		{HallNo: "MH 303", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC108", "7376231EC117")},

		// S.No 95 - MH 305 - B.E. CS - 22CS601
		{HallNo: "MH 305", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS138", "7376231CS152")},

		// S.No 96 - MH 305 - B.E. EC - 22EC601
		{HallNo: "MH 305", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC118", "7376231EC127")},

		// S.No 97 - WW 005 - B.Tech. IT - 22IT601
		{HallNo: "WW 005", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT228", "7376232IT237")},

		// S.No 98 - WW 005 - B.Tech. AL - 22AM601
		{HallNo: "WW 005", CourseCode: "22AM601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AL192", "7376232AL193")
			r = append(r, expandRange("7376232AL195", "7376232AL207")...)
			return r
		}()},

		// S.No 99 - WW 006 - B.E. ME - 22ME601
		{HallNo: "WW 006", CourseCode: "22ME601", RegisterNos: expandRange("7376231ME107", "7376231ME121")},

		// S.No 100 - WW 006 - B.Tech. IT - 22IT601
		{HallNo: "WW 006", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT258", "7376232IT267")},

		// S.No 101 - WW 007 - B.E. ME - 22ME601
		{HallNo: "WW 007", CourseCode: "22ME601", RegisterNos: expandRange("7376231ME122", "7376231ME136")},

		// S.No 102 - WW 007 - B.Tech. IT - 22IT601
		{HallNo: "WW 007", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT268", "7376232IT277")},

		// S.No 103 - WW 008 - B.Tech. BT - 22BT601
		{HallNo: "WW 008", CourseCode: "22BT601", RegisterNos: []string{"7376222BT110", "7376222BT152"}},

		// S.No 104 - WW 008 - B.E. ME - 22ME601
		{HallNo: "WW 008", CourseCode: "22ME601", RegisterNos: expandRange("7376231ME147", "7376231ME161")},

		// S.No 105 - WW 008 - B.Tech. IT - 22IT601
		{HallNo: "WW 008", CourseCode: "22IT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT503", "7376242IT505")...)
			r = append(r, expandRange("7376242IT507", "7376242IT511")...)
			return r
		}()},

		// S.No 106 - WW 011 - B.Tech. BT - 22BT601
		{HallNo: "WW 011", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT168", "7376232BT177")},

		// S.No 107 - WW 011 - B.Tech. CT - 22CT601
		{HallNo: "WW 011", CourseCode: "22CT601", RegisterNos: expandRange("7376232CT108", "7376232CT122")},

		// S.No 108 - WW 012 - B.Tech. BT - 22BT601
		{HallNo: "WW 012", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT189", "7376232BT198")},

		// S.No 109 - WW 012 - B.Tech. CT - 22CT601
		{HallNo: "WW 012", CourseCode: "22CT601", RegisterNos: expandRange("7376232CT138", "7376232CT152")},

		// S.No 110 - WW 113 - B.E. CS - 22CS601
		{HallNo: "WW 113", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS199", "7376231CS213")},

		// S.No 111 - WW 113 - B.E. EC - 22EC601
		{HallNo: "WW 113", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC158", "7376231EC167")},

		// S.No 112 - WW 114 - B.E. CS - 22CS601
		{HallNo: "WW 114", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS229", "7376231CS243")},

		// S.No 113 - WW 114 - B.E. EC - 22EC601
		{HallNo: "WW 114", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC178", "7376231EC187")},

		// S.No 114 - WW 115 - B.E. CS - 22CS601
		{HallNo: "WW 115", CourseCode: "22CS601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS274", "7376231CS287")...)
			r = append(r, "7376231CS289")
			return r
		}()},

		// S.No 115 - WW 115 - B.E. EC - 22EC601
		{HallNo: "WW 115", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC208", "7376231EC217")},

		// S.No 116 - WW 117 - B.E. CS - 22CS601
		{HallNo: "WW 117", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS305", "7376231CS319")},

		// S.No 117 - WW 117 - B.E. EC - 22EC601
		{HallNo: "WW 117", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC228", "7376231EC237")},

		// S.No 118 - WW 118 - 22EC601
		{HallNo: "WW 118", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC278", "7376231EC287")},

		// S.No 119 - WW 118 - B.Tech. AD - 22AI601
		{HallNo: "WW 118", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD110", "7376232AD124")},

		// S.No 120 - WW 202 - B.E. EC - 22EC601
		{HallNo: "WW 202", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC288", "7376231EC312")},

		// S.No 121 - WW 202 - B.Tech. AD - 22AI601
		{HallNo: "WW 202", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD125", "7376232AD149")},

		// S.No 122 - WW 203 - B.E. EC - 22EC601
		{HallNo: "WW 203", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC313", "7376231EC322")},

		// S.No 123 - WW 203 - B.Tech. AD - 22AI601
		{HallNo: "WW 203", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD150", "7376232AD164")},

		// S.No 124 - WW 204 - B.Tech. IT - 22IT601
		{HallNo: "WW 204", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT101", "7376232IT110")},

		// S.No 125 - WW 204 - B.Tech. AD - 22AI601
		{HallNo: "WW 204", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD225", "7376232AD239")},

		// S.No 126 - WW 205 - B.Tech. IT - 22IT601
		{HallNo: "WW 205", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT162", "7376232IT171")},

		// S.No 127 - WW 205 - B.Tech. AL - 22AM601
		{HallNo: "WW 205", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL112", "7376232AL126")},

		// S.No 128 - WW 211 - B.E. EC - 22EC601
		{HallNo: "WW 211", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC323", "7376231EC332")},

		// S.No 129 - WW 211 - B.Tech. AD - 22AI601
		{HallNo: "WW 211", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD165", "7376232AD179")},

		// S.No 130 - WW 212 - B.E. MC - 22MC601
		{HallNo: "WW 212", CourseCode: "22MC601", RegisterNos: []string{
			"7376231MC506", "7376231MC507", "7376231MC509", "7376231MC510",
		}},

		// S.No 131 - WW 212 - B.E. CE - 22CE601
		{HallNo: "WW 212", CourseCode: "22CE601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CE105", "7376231CE129")...)
			r = append(r, expandRange("7376241CE501", "7376241CE504")...)
			return r
		}()},

		// S.No 132 - WW 213 - B.Tech. AD - 22AI601
		{HallNo: "WW 213", CourseCode: "22AI601", RegisterNos: []string{"7376232AD502"}},

		// S.No 133 - WW 213 - B.Tech. AL - 22AM601
		{HallNo: "WW 213", CourseCode: "22AM601", RegisterNos: []string{"7376222AL154"}},

		// S.No 134 - WW 213 - B.Tech. IT - 22IT601
		{HallNo: "WW 213", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT141", "7376232IT150")},

		// S.No 135 - WW 213 - B.Tech. AD - 22AI601
		{HallNo: "WW 213", CourseCode: "22AI601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD285", "7376232AD286")
			r = append(r, expandRange("7376242AD501", "7376242AD510")...)
			return r
		}()},

		// S.No 136 - WW 213 - B.Tech. AL - 22AM601
		{HallNo: "WW 213", CourseCode: "22AM601", RegisterNos: []string{"7376232AL101"}},

		// S.No 137 - WW 214 - B.Tech. IT - 22IT601
		{HallNo: "WW 214", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT172", "7376232IT181")},

		// S.No 138 - WW 214 - B.Tech. AL - 22AM601
		{HallNo: "WW 214", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL127", "7376232AL141")},

		// S.No 139 - WW 215 - B.Tech. IT - 22IT601
		{HallNo: "WW 215", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT182", "7376232IT191")},

		// S.No 140 - WW 215 - B.Tech. AL - 22AM601
		{HallNo: "WW 215", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL142", "7376232AL156")},

		// S.No 141 - WW 218 - B.E. EE - 22EE601
		{HallNo: "WW 218", CourseCode: "22EE601", RegisterNos: expandRange("7376231EE102", "7376231EE111")},

		// S.No 142 - WW 218 - B.Tech. AG - 22AG601
		{HallNo: "WW 218", CourseCode: "22AG601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AG129")
			r = append(r, expandRange("7376232AG131", "7376232AG144")...)
			return r
		}()},

		// S.No 143 - WW 219 - B.Tech. FD - 22FD601
		{HallNo: "WW 219", CourseCode: "22FD601", RegisterNos: []string{"7376222FD107"}},

		// S.No 144 - WW 219 - B.E. EE - 22EE601
		{HallNo: "WW 219", CourseCode: "22EE601", RegisterNos: expandRange("7376231EE112", "7376231EE121")},

		// S.No 145 - WW 219 - B.Tech. AG - 22AG601
		{HallNo: "WW 219", CourseCode: "22AG601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG145", "7376232AG154")...)
			r = append(r, expandRange("7376242AG501", "7376242AG504")...)
			return r
		}()},

		// S.No 146 - WW 222 - B.Tech. FD - 22FD601
		{HallNo: "WW 222", CourseCode: "22FD601", RegisterNos: []string{"7376222FD116", "7376222FD125"}},

		// S.No 147 - WW 222 - B.E. EE - 22EE601
		{HallNo: "WW 222", CourseCode: "22EE601", RegisterNos: expandRange("7376231EE122", "7376231EE146")},

		// S.No 148 - WW 222 - B.Tech. FD - 22FD601
		{HallNo: "WW 222", CourseCode: "22FD601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FD101", "7376232FD103")...)
			r = append(r, expandRange("7376232FD105", "7376232FD120")...)
			r = append(r, expandRange("7376232FD122", "7376232FD125")...)
			return r
		}()},

		// S.No 149 - WW 223 - B.E. EE - 22EE601
		{HallNo: "WW 223", CourseCode: "22EE601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EE147", "7376231EE161")...)
			r = append(r, expandRange("7376241EE501", "7376241EE506")...)
			return r
		}()},

		// S.No 150 - WW 223 - B.E. EI - 22EI601
		{HallNo: "WW 223", CourseCode: "22EI601", RegisterNos: expandRange("7376231EI101", "7376231EI104")},

		// S.No 151 - WW 223 - B.Tech. FD - 22FD601
		{HallNo: "WW 223", CourseCode: "22FD601", RegisterNos: expandRange("7376232FD126", "7376232FD150")},

		// S.No 152 - WW 224 - B.Tech. FT - 22FT601
		{HallNo: "WW 224", CourseCode: "22FT601", RegisterNos: []string{"7376232FT501"}},

		// S.No 153 - WW 224 - B.E. EI - 22EI601
		{HallNo: "WW 224", CourseCode: "22EI601", RegisterNos: expandRange("7376231EI105", "7376231EI131")},

		// S.No 154 - WW 224 - B.Tech. FD - 22FD601
		{HallNo: "WW 224", CourseCode: "22FD601", RegisterNos: []string{"7376232FD151", "7376232FD152"}},

		// S.No 155 - WW 224 - B.Tech. FT - 22FT601
		{HallNo: "WW 224", CourseCode: "22FT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FT101", "7376232FT106")...)
			r = append(r, expandRange("7376232FT108", "7376232FT120")...)
			r = append(r, "7376242FT501")
			return r
		}()},

		// S.No 156 - WW 225 - B.E. EI - 22EI601
		{HallNo: "WW 225", CourseCode: "22EI601", RegisterNos: []string{"7376231EI503"}},

		// S.No 157 - WW 225 - B.E. SE - 22IS601
		{HallNo: "WW 225", CourseCode: "22IS601", RegisterNos: []string{"7376221SE134", "7376221SE140"}},

		// S.No 158 - WW 225 - B.E. EI - 22EI601
		{HallNo: "WW 225", CourseCode: "22EI601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EI132", "7376231EI160")...)
			r = append(r, expandRange("7376241EI501", "7376241EI504")...)
			return r
		}()},

		// S.No 159 - WW 225 - B.E. SE - 22IS601
		{HallNo: "WW 225", CourseCode: "22IS601", RegisterNos: expandRange("7376231SE101", "7376231SE114")},

		// S.No 160 - WW 226 - B.E. BM - 22BM601
		{HallNo: "WW 226", CourseCode: "22BM601", RegisterNos: []string{"7376221BM128"}},

		// S.No 161 - WW 226 - B.E. SE - 22IS601
		{HallNo: "WW 226", CourseCode: "22IS601", RegisterNos: []string{"7376231SE504"}},

		// S.No 162 - WW 226 - B.E. BM - 22BM601
		{HallNo: "WW 226", CourseCode: "22BM601", RegisterNos: expandRange("7376231BM101", "7376231BM107")},

		// S.No 163 - WW 226 - B.E. SE - 22IS601
		{HallNo: "WW 226", CourseCode: "22IS601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE115", "7376231SE143")...)
			r = append(r, expandRange("7376231SE145", "7376231SE155")...)
			r = append(r, "7376241SE501")
			return r
		}()},

		// S.No 164 - WW 227 - B.E. CE - 22CE601
		{HallNo: "WW 227", CourseCode: "22CE601", RegisterNos: []string{"7376221CE122", "7376221CE124"}},

		// S.No 165 - WW 227 - B.E. BM - 22BM601
		{HallNo: "WW 227", CourseCode: "22BM601", RegisterNos: []string{"7376231BM502"}},

		// S.No 166 - WW 227 - B.E. CE - 22CE601
		{HallNo: "WW 227", CourseCode: "22CE601", RegisterNos: []string{
			"7376231CE101", "7376231CE103", "7376231CE104",
		}},

		// S.No 167 - WW 227 - B.E. BM - 22BM601
		{HallNo: "WW 227", CourseCode: "22BM601", RegisterNos: expandRange("7376231BM108", "7376231BM151")},
	}
}

// buildSeatingData11AN returns all seating records from the 11-05-2026 AN exam
// Exam Date: 11-05-2026 | Session: AN - 01:30 PM to 04:30 PM
func buildSeatingData11AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 201 - B.E. CS - 22CS504
		{HallNo: "EW 201", CourseCode: "22CS504", RegisterNos: []string{
			"7376221CS240", "7376221CS275", "7376221CS288", "7376221CS322",
		}},

		// S.No 2 - EW 201 - B.E. EC - 22EC504
		{HallNo: "EW 201", CourseCode: "22EC504", RegisterNos: []string{"7376221EC107"}},

		// S.No 3 - EW 201 - B.E. CS - 22CS504
		{HallNo: "EW 201", CourseCode: "22CS504", RegisterNos: []string{
			"7376231CS102", "7376231CS139", "7376231CS190", "7376231CS230",
			"7376231CS235", "7376231CS244", "7376231CS259", "7376231CS282",
		}},

		// S.No 4 - EW 201 - B.E. EC - 22EC504
		{HallNo: "EW 201", CourseCode: "22EC504", RegisterNos: []string{
			"7376231EC101", "7376231EC283",
		}},

		// S.No 5 - EW 201 - B.E. MZ - 22MC504
		{HallNo: "EW 201", CourseCode: "22MC504", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107", "7376231MZ111", "7376231MZ113",
			"7376231MZ114", "7376231MZ135", "7376231MZ145", "7376231MZ154",
			"7376241MZ501",
		}},

		// S.No 6 - EW 201 - B.Tech. CB - 22CB504
		{HallNo: "EW 201", CourseCode: "22CB504", RegisterNos: []string{"7376232CB111"}},

		// S.No 7 - EW 202 - B.E. CE - 22CE504
		{HallNo: "EW 202", CourseCode: "22CE504", RegisterNos: []string{"7376221CE124"}},

		// S.No 8 - EW 202 - B.E. CD - 22CD504
		{HallNo: "EW 202", CourseCode: "22CD504", RegisterNos: []string{"7376221CD114"}},

		// S.No 9 - EW 202 - B.Tech. AG - 22AG504
		{HallNo: "EW 202", CourseCode: "22AG504", RegisterNos: []string{"7376222AG120"}},

		// S.No 10 - EW 202 - B.E. CE - 22CE504
		{HallNo: "EW 202", CourseCode: "22CE504", RegisterNos: []string{
			"7376231CE113", "7376231CE117", "7376231CE120", "7376231CE122",
			"7376241CE501",
		}},

		// S.No 11 - EW 202 - B.E. EC - 22EC504
		{HallNo: "EW 202", CourseCode: "22EC504", RegisterNos: []string{
			"7376231EC305", "7376231EC331", "7376231EC334",
			"7376241EC512", "7376241EC516",
		}},

		// S.No 12 - EW 202 - B.E. CD - 22CD504
		{HallNo: "EW 202", CourseCode: "22CD504", RegisterNos: []string{
			"7376231CD115", "7376231CD143", "7376241CD501", "7376241CD502",
		}},

		// S.No 13 - EW 202 - B.Tech. CB - 22CB504
		{HallNo: "EW 202", CourseCode: "22CB504", RegisterNos: []string{
			"7376232CB123", "7376232CB133", "7376232CB144",
			"7376242CB502", "7376242CB503",
		}},

		// S.No 14 - EW 202 - B.Tech. AG - 22AG504
		{HallNo: "EW 202", CourseCode: "22AG504", RegisterNos: []string{
			"7376232AG129", "7376232AG151", "7376232AG153",
		}},

		// S.No 15 - EW 206 - B.E. EI - 22EI504
		{HallNo: "EW 206", CourseCode: "22EI504", RegisterNos: []string{"7376231EI503"}},

		// S.No 16 - EW 206 - B.E. SE - 22IS504
		{HallNo: "EW 206", CourseCode: "22IS504", RegisterNos: []string{"7376221SE134", "7376221SE140"}},

		// S.No 17 - EW 206 - B.Tech. BT - 22BT504
		{HallNo: "EW 206", CourseCode: "22BT504", RegisterNos: []string{"7376222BT110"}},

		// S.No 18 - EW 206 - B.Tech. FD - 22FD504
		{HallNo: "EW 206", CourseCode: "22FD504", RegisterNos: []string{"7376222FD107", "7376222FD125"}},

		// S.No 19 - EW 206 - B.Tech. IT - 22IT504
		{HallNo: "EW 206", CourseCode: "22IT504", RegisterNos: []string{"7376222IT110"}},

		// S.No 20 - EW 206 - B.Tech. AD - 22AI504
		{HallNo: "EW 206", CourseCode: "22AI504", RegisterNos: []string{"7376232AD502"}},

		// S.No 21 - EW 206 - B.E. EE - 22EE504
		{HallNo: "EW 206", CourseCode: "22EE504", RegisterNos: []string{"7376231EE111", "7376231EE115"}},

		// S.No 22 - EW 206 - B.E. EI - 22EI504
		{HallNo: "EW 206", CourseCode: "22EI504", RegisterNos: []string{"7376231EI156", "7376231EI159"}},

		// S.No 23 - EW 206 - B.E. ME - 22ME504
		{HallNo: "EW 206", CourseCode: "22ME504", RegisterNos: []string{"7376231ME130"}},

		// S.No 24 - EW 206 - B.E. BM - 22BM504
		{HallNo: "EW 206", CourseCode: "22BM504", RegisterNos: []string{
			"7376231BM107", "7376231BM132", "7376231BM137", "7376231BM148",
		}},

		// S.No 25 - EW 206 - B.E. SE - 22IS504
		{HallNo: "EW 206", CourseCode: "22IS504", RegisterNos: []string{"7376231SE103", "7376231SE128"}},

		// S.No 26 - EW 206 - B.Tech. BT - 22BT504
		{HallNo: "EW 206", CourseCode: "22BT504", RegisterNos: []string{
			"7376232BT115", "7376232BT142", "7376232BT163",
		}},

		// S.No 27 - EW 206 - B.Tech. CT - 22CT504
		{HallNo: "EW 206", CourseCode: "22CT504", RegisterNos: []string{"7376232CT122"}},

		// S.No 28 - EW 206 - B.Tech. AD - 22AI504
		{HallNo: "EW 206", CourseCode: "22AI504", RegisterNos: []string{"7376232AD228", "7376232AD250"}},

		// S.No 29 - EW 206 - B.Tech. AL - 22AM504
		{HallNo: "EW 206", CourseCode: "22AM504", RegisterNos: []string{"7376242AL501"}},
	}
}

// buildSeatingData12FN returns all seating records from the 12-05-2026 FN exam
// Exam Date: 12-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData12FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 302 - B.E. CS - 22CS402
		{HallNo: "AE 302", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS154", "7376241CS157")...)
			r = append(r, expandRange("7376241CS159", "7376241CS169")...)
			return r
		}()},

		// S.No 2 - AE 302 - B.E. EC - 22EC402
		{HallNo: "AE 302", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC127", "7376241EC136")},

		// S.No 3 - EW 101 - B.E. CS - 22CS402
		{HallNo: "EW 101", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS170", "7376241CS184")},

		// S.No 4 - EW 101 - B.E. EC - 22EC402
		{HallNo: "EW 101", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC137", "7376241EC146")},

		// S.No 5 - EW 102 - B.E. CS - 22CS402
		{HallNo: "EW 102", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS185", "7376241CS188")...)
			r = append(r, expandRange("7376241CS190", "7376241CS200")...)
			return r
		}()},

		// S.No 6 - EW 102 - B.E. EC - 22EC402
		{HallNo: "EW 102", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC147", "7376241EC156")},

		// S.No 7 - EW 103 - B.E. CS - 22CS402
		{HallNo: "EW 103", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS247", "7376241CS261")},

		// S.No 8 - EW 103 - B.E. EC - 22EC402
		{HallNo: "EW 103", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC188", "7376241EC197")},

		// S.No 9 - EW 104 - B.E. CS - 22CS402
		{HallNo: "EW 104", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS337", "7376241CS351")},

		// S.No 10 - EW 104 - B.E. EC - 22EC402
		{HallNo: "EW 104", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC250", "7376241EC259")},

		// S.No 11 - EW 105 - B.E. CS - 22CS402
		{HallNo: "EW 105", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241CS352", "7376241CS353")
			r = append(r, expandRange("7376241CS355", "7376241CS367")...)
			return r
		}()},

		// S.No 12 - EW 105 - B.E. EC - 22EC402
		{HallNo: "EW 105", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC260", "7376241EC269")},

		// S.No 13 - EW 106 - 22EC402
		{HallNo: "EW 106", CourseCode: "22EC402", RegisterNos: []string{"7376241EC513", "7376241EC515"}},

		// S.No 14 - EW 106 - B.E. CS - 22CS402
		{HallNo: "EW 106", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS469", "7376241CS476")...)
			r = append(r, expandRange("7376251CS501", "7376251CS507")...)
			return r
		}()},

		// S.No 15 - EW 106 - B.E. EC - 22EC402
		{HallNo: "EW 106", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC345", "7376241EC352")},

		// S.No 16 - EW 107 - B.E. CS - 22CS402
		{HallNo: "EW 107", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS216", "7376241CS228")...)
			r = append(r, "7376241CS230", "7376241CS231")
			return r
		}()},

		// S.No 17 - EW 107 - B.E. EC - 22EC402
		{HallNo: "EW 107", CourseCode: "22EC402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC167", "7376241EC174")...)
			r = append(r, "7376241EC176", "7376241EC177")
			return r
		}()},

		// S.No 18 - EW 108 - B.E. CS - 22CS402
		{HallNo: "EW 108", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS262", "7376241CS276")},

		// S.No 19 - EW 108 - B.E. EC - 22EC402
		{HallNo: "EW 108", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC198", "7376241EC207")},

		// S.No 20 - EW 109 - B.E. CS - 22CS402
		{HallNo: "EW 109", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS292", "7376241CS306")},

		// S.No 21 - EW 109 - B.E. EC - 22EC402
		{HallNo: "EW 109", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC219", "7376241EC228")},

		// S.No 22 - EW 111 - B.E. CS - 22CS402
		{HallNo: "EW 111", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS322", "7376241CS336")},

		// S.No 23 - EW 111 - B.E. EC - 22EC402
		{HallNo: "EW 111", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC240", "7376241EC249")},

		// S.No 24 - EW 112 - B.E. CS - 22CS402
		{HallNo: "EW 112", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS368", "7376241CS382")},

		// S.No 25 - EW 112 - B.E. EC - 22EC402
		{HallNo: "EW 112", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC270", "7376241EC279")},

		// S.No 26 - EW 113 - B.Tech. IT - 22IT402
		{HallNo: "EW 113", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT282", "7376242IT296")},

		// S.No 27 - EW 113 - B.Tech. AD - 22AI402
		{HallNo: "EW 113", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD232", "7376242AD241")},

		// S.No 28 - EW 114 - B.E. EE - 22EE402
		{HallNo: "EW 114", CourseCode: "22EE402", RegisterNos: []string{"7376231EE111", "7376231EE115"}},

		// S.No 29 - EW 114 - 22EE402
		{HallNo: "EW 114", CourseCode: "22EE402", RegisterNos: expandRange("7376241EE101", "7376241EE110")},

		// S.No 30 - EW 114 - B.Tech. IT - 22IT402
		{HallNo: "EW 114", CourseCode: "22IT402", RegisterNos: expandRange("7376252IT514", "7376252IT516")},

		// S.No 31 - EW 114 - B.Tech. AD - 22AI402
		{HallNo: "EW 114", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD292", "7376242AD301")},

		// S.No 32 - EW 115 - B.E. EE - 22EE402
		{HallNo: "EW 115", CourseCode: "22EE402", RegisterNos: expandRange("7376241EE147", "7376241EE161")},

		// S.No 33 - EW 115 - B.Tech. AD - 22AI402
		{HallNo: "EW 115", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD337", "7376242AD346")},

		// S.No 34 - EW 116 - B.E. EE - 22EE402
		{HallNo: "EW 116", CourseCode: "22EE402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE162", "7376241EE171")...)
			r = append(r, expandRange("7376241EE173", "7376241EE177")...)
			return r
		}()},

		// S.No 35 - EW 116 - B.Tech. AD - 22AI402
		{HallNo: "EW 116", CourseCode: "22AI402", RegisterNos: expandRange("7376252AD501", "7376252AD510")},

		// S.No 36 - EW 117 - B.E. EE - 22EE402
		{HallNo: "EW 117", CourseCode: "22EE402", RegisterNos: expandRange("7376241EE193", "7376241EE207")},

		// S.No 37 - EW 117 - B.Tech. AL - 22AM402
		{HallNo: "EW 117", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL102", "7376242AL111")},

		// S.No 38 - EW 118 - B.Tech. BT - 22BT402
		{HallNo: "EW 118", CourseCode: "22BT402", RegisterNos: []string{
			"7376232BT142", "7376232BT163", "7376232BT176",
		}},

		// S.No 39 - EW 118 - B.E. EE - 22EE402
		{HallNo: "EW 118", CourseCode: "22EE402", RegisterNos: expandRange("7376251EE506", "7376251EE517")},

		// S.No 40 - EW 118 - B.Tech. AL - 22AM402
		{HallNo: "EW 118", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL122", "7376242AL131")},

		// S.No 41 - EW 201 - B.Tech. AD - 22AI402
		{HallNo: "EW 201", CourseCode: "22AI402", RegisterNos: []string{"7376232AD502"}},

		// S.No 42 - EW 201 - 22AI402
		{HallNo: "EW 201", CourseCode: "22AI402", RegisterNos: []string{
			"7376232AD174", "7376232AD250", "7376232AD282",
		}},

		// S.No 43 - EW 201 - B.E. EC - 22EC402
		{HallNo: "EW 201", CourseCode: "22EC402", RegisterNos: []string{"7376251EC520", "7376251EC521"}},

		// S.No 44 - EW 201 - B.Tech. IT - 22IT402
		{HallNo: "EW 201", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT106", "7376242IT120")},

		// S.No 45 - EW 201 - B.Tech. AD - 22AI402
		{HallNo: "EW 201", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD102", "7376242AD105")},

		// S.No 46 - EW 202 - B.Tech. IT - 22IT402
		{HallNo: "EW 202", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT136", "7376242IT150")},

		// S.No 47 - EW 202 - B.Tech. AD - 22AI402
		{HallNo: "EW 202", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD116", "7376242AD125")},

		// S.No 48 - EW 203 - B.Tech. IT - 22IT402
		{HallNo: "EW 203", CourseCode: "22IT402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT297", "7376242IT303")...)
			r = append(r, expandRange("7376242IT305", "7376242IT312")...)
			return r
		}()},

		// S.No 49 - EW 203 - B.Tech. AD - 22AI402
		{HallNo: "EW 203", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD242", "7376242AD251")},

		// S.No 50 - EW 204 - B.Tech. IT - 22IT402
		{HallNo: "EW 204", CourseCode: "22IT402", RegisterNos: []string{"7376242IT502"}},

		// S.No 51 - EW 204 - 22IT402
		{HallNo: "EW 204", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT343", "7376242IT351")},

		// S.No 52 - EW 204 - B.Tech. AD - 22AI402
		{HallNo: "EW 204", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD272", "7376242AD281")},

		// S.No 53 - EW 205 - B.E. EE - 22EE402
		{HallNo: "EW 205", CourseCode: "22EE402", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EE111")
			r = append(r, expandRange("7376241EE113", "7376241EE121")...)
			return r
		}()},

		// S.No 54 - EW 205 - B.Tech. AD - 22AI402
		{HallNo: "EW 205", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD302", "7376242AD311")},

		// S.No 55 - EW 206 - B.E. EE - 22EE402
		{HallNo: "EW 206", CourseCode: "22EE402", RegisterNos: expandRange("7376241EE122", "7376241EE146")},

		// S.No 56 - EW 206 - B.Tech. AD - 22AI402
		{HallNo: "EW 206", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD312", "7376242AD336")},

		// S.No 57 - EW 207 - B.E. CS - 22CS402
		{HallNo: "EW 207", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS454", "7376241CS468")},

		// S.No 58 - EW 207 - B.E. EC - 22EC402
		{HallNo: "EW 207", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC335", "7376241EC344")},

		// S.No 59 - EW 208 - 22EC402
		{HallNo: "EW 208", CourseCode: "22EC402", RegisterNos: []string{"7376241EC516"}},

		// S.No 60 - EW 208 - B.E. CS - 22CS402
		{HallNo: "EW 208", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS508", "7376251CS513")...)
			r = append(r, expandRange("7376251CS515", "7376251CS523")...)
			return r
		}()},

		// S.No 61 - EW 208 - B.E. EC - 22EC402
		{HallNo: "EW 208", CourseCode: "22EC402", RegisterNos: expandRange("7376251EC501", "7376251EC509")},

		// S.No 62 - EW 209 - B.Tech. IT - 22IT402
		{HallNo: "EW 209", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT121", "7376242IT135")},

		// S.No 63 - EW 209 - B.Tech. AD - 22AI402
		{HallNo: "EW 209", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD106", "7376242AD115")},

		// S.No 64 - EW 210 - B.Tech. IT - 22IT402
		{HallNo: "EW 210", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT167", "7376242IT176")},

		// S.No 65 - EW 210 - B.Tech. AD - 22AI402
		{HallNo: "EW 210", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD137", "7376242AD146")},

		// S.No 66 - EW 211 - B.Tech. IT - 22IT402
		{HallNo: "EW 211", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT232", "7376242IT241")},

		// S.No 67 - EW 211 - B.Tech. AD - 22AI402
		{HallNo: "EW 211", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD187", "7376242AD196")},

		// S.No 68 - EW 212 - B.Tech. IT - 22IT402
		{HallNo: "EW 212", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT242", "7376242IT266")},

		// S.No 69 - EW 212 - B.Tech. AD - 22AI402
		{HallNo: "EW 212", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD197", "7376242AD221")},

		// S.No 70 - EW 213 - B.Tech. BT - 22BT402
		{HallNo: "EW 213", CourseCode: "22BT402", RegisterNos: []string{"7376232BT209"}},

		// S.No 71 - EW 213 - 22BT402
		{HallNo: "EW 213", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT102", "7376242BT115")},

		// S.No 72 - EW 213 - B.Tech. AL - 22AM402
		{HallNo: "EW 213", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL132", "7376242AL141")},

		// S.No 73 - EW 214 - B.Tech. BT - 22BT402
		{HallNo: "EW 214", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT116", "7376242BT130")},

		// S.No 74 - EW 214 - B.Tech. AL - 22AM402
		{HallNo: "EW 214", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL142", "7376242AL151")},

		// S.No 75 - EW 215 - B.Tech. BT - 22BT402
		{HallNo: "EW 215", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT131", "7376242BT145")},

		// S.No 76 - EW 215 - B.Tech. AL - 22AM402
		{HallNo: "EW 215", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL152", "7376242AL161")},

		// S.No 77 - EW 216 - B.Tech. BT - 22BT402
		{HallNo: "EW 216", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT146", "7376242BT155")},

		// S.No 78 - EW 216 - B.Tech. AL - 22AM402
		{HallNo: "EW 216", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL162", "7376242AL171")},

		// S.No 79 - EW 217 - B.Tech. BT - 22BT402
		{HallNo: "EW 217", CourseCode: "22BT402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT156", "7376242BT160")...)
			r = append(r, expandRange("7376242BT162", "7376242BT166")...)
			return r
		}()},

		// S.No 80 - EW 217 - B.Tech. AL - 22AM402
		{HallNo: "EW 217", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL172", "7376242AL181")},

		// S.No 81 - EW 218 - B.Tech. BT - 22BT402
		{HallNo: "EW 218", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT167", "7376242BT191")},

		// S.No 82 - EW 218 - B.Tech. AL - 22AM402
		{HallNo: "EW 218", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL182", "7376242AL206")},

		// S.No 83 - MH 301 - B.E. EC - 22EC402
		{HallNo: "MH 301", CourseCode: "22EC402", RegisterNos: []string{
			"7376221EC105", "7376221EC107", "7376221EC116",
			"7376221EC161", "7376221EC192", "7376221EC226",
		}},

		// S.No 84 - MH 301 - B.E. CS - 22CS402
		{HallNo: "MH 301", CourseCode: "22CS402", RegisterNos: []string{
			"7376231CS102", "7376231CS103", "7376231CS190", "7376231CS235",
			"7376231CS244", "7376231CS259", "7376231CS292", "7376231CS346",
		}},

		// S.No 85 - MH 301 - B.E. EC - 22EC402
		{HallNo: "MH 301", CourseCode: "22EC402", RegisterNos: []string{
			"7376231EC110", "7376231EC112", "7376231EC121", "7376231EC196",
		}},

		// S.No 86 - MH 301 - B.E. CS - 22CS402
		{HallNo: "MH 301", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS102", "7376241CS108")},

		// S.No 87 - MH 302 - B.E. EC - 22EC402
		{HallNo: "MH 302", CourseCode: "22EC402", RegisterNos: []string{"7376231EC507", "7376231EC514"}},

		// S.No 88 - MH 302 - 22EC402
		{HallNo: "MH 302", CourseCode: "22EC402", RegisterNos: []string{
			"7376231EC231", "7376231EC283", "7376231EC297",
			"7376231EC305", "7376231EC331", "7376231EC334",
		}},

		// S.No 89 - MH 302 - B.E. CS - 22CS402
		{HallNo: "MH 302", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS109", "7376241CS123")},

		// S.No 90 - MH 302 - B.E. EC - 22EC402
		{HallNo: "MH 302", CourseCode: "22EC402", RegisterNos: []string{"7376241EC103", "7376241EC104"}},

		// S.No 91 - MH 303 - B.E. CS - 22CS402
		{HallNo: "MH 303", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS124", "7376241CS138")},

		// S.No 92 - MH 303 - B.E. EC - 22EC402
		{HallNo: "MH 303", CourseCode: "22EC402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC105", "7376241EC110")...)
			r = append(r, "7376241EC112", "7376241EC113", "7376241EC115", "7376241EC116")
			return r
		}()},

		// S.No 93 - MH 305 - B.E. CS - 22CS402
		{HallNo: "MH 305", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS139", "7376241CS153")},

		// S.No 94 - MH 305 - B.E. EC - 22EC402
		{HallNo: "MH 305", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC117", "7376241EC126")},

		// S.No 95 - WW 002 - B.Tech. IT - 22IT402
		{HallNo: "WW 002", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT222", "7376242IT231")},

		// S.No 96 - WW 002 - B.Tech. AD - 22AI402
		{HallNo: "WW 002", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD177", "7376242AD186")},

		// S.No 97 - WW 005 - B.Tech. IT - 22IT402
		{HallNo: "WW 005", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT267", "7376242IT281")},

		// S.No 98 - WW 005 - B.Tech. AD - 22AI402
		{HallNo: "WW 005", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD222", "7376242AD231")},

		// S.No 99 - WW 006 - B.Tech. IT - 22IT402
		{HallNo: "WW 006", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT313", "7376242IT327")},

		// S.No 100 - WW 006 - B.Tech. AD - 22AI402
		{HallNo: "WW 006", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD252", "7376242AD261")},

		// S.No 101 - WW 007 - B.Tech. IT - 22IT402
		{HallNo: "WW 007", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT328", "7376242IT342")},

		// S.No 102 - WW 007 - B.Tech. AD - 22AI402
		{HallNo: "WW 007", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD262", "7376242AD271")},

		// S.No 103 - WW 008 - B.Tech. IT - 22IT402
		{HallNo: "WW 008", CourseCode: "22IT402", RegisterNos: []string{"7376242IT506", "7376242IT509"}},

		// S.No 104 - WW 008 - 22IT402
		{HallNo: "WW 008", CourseCode: "22IT402", RegisterNos: expandRange("7376252IT501", "7376252IT513")},

		// S.No 105 - WW 008 - B.Tech. AD - 22AI402
		{HallNo: "WW 008", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD282", "7376242AD291")},

		// S.No 106 - WW 011 - B.Tech. AL - 22AM402
		{HallNo: "WW 011", CourseCode: "22AM402", RegisterNos: []string{
			"7376222AL152", "7376232AL504", "7376232AL510",
		}},

		// S.No 107 - WW 011 - B.E. EE - 22EE402
		{HallNo: "WW 011", CourseCode: "22EE402", RegisterNos: expandRange("7376241EE178", "7376241EE192")},

		// S.No 108 - WW 011 - B.Tech. AD - 22AI402
		{HallNo: "WW 011", CourseCode: "22AI402", RegisterNos: expandRange("7376252AD511", "7376252AD516")},

		// S.No 109 - WW 011 - B.Tech. AL - 22AM402
		{HallNo: "WW 011", CourseCode: "22AM402", RegisterNos: []string{"7376242AL101"}},

		// S.No 110 - WW 012 - B.E. EE - 22EE402
		{HallNo: "WW 012", CourseCode: "22EE402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE208", "7376241EE217")...)
			r = append(r, expandRange("7376251EE501", "7376251EE505")...)
			return r
		}()},

		// S.No 111 - WW 012 - B.Tech. AL - 22AM402
		{HallNo: "WW 012", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL112", "7376242AL121")},

		// S.No 112 - WW 113 - B.E. CS - 22CS402
		{HallNo: "WW 113", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS201", "7376241CS215")},

		// S.No 113 - WW 113 - B.E. EC - 22EC402
		{HallNo: "WW 113", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC157", "7376241EC166")},

		// S.No 114 - WW 114 - B.E. CS - 22CS402
		{HallNo: "WW 114", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS232", "7376241CS246")},

		// S.No 115 - WW 114 - B.E. EC - 22EC402
		{HallNo: "WW 114", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC178", "7376241EC187")},

		// S.No 116 - WW 115 - B.E. CS - 22CS402
		{HallNo: "WW 115", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS277", "7376241CS291")},

		// S.No 117 - WW 115 - B.E. EC - 22EC402
		{HallNo: "WW 115", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC209", "7376241EC218")},

		// S.No 118 - WW 117 - B.E. CS - 22CS402
		{HallNo: "WW 117", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS307", "7376241CS321")},

		// S.No 119 - WW 117 - B.E. EC - 22EC402
		{HallNo: "WW 117", CourseCode: "22EC402", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC229", "7376241EC230")
			r = append(r, expandRange("7376241EC231", "7376241EC239")...) 
			return r
		}()},
	}
}


		// S.No 120 - WW 118 - B.E. CS - 22CS402
		{HallNo: "WW 118", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS383", "7376241CS397")},

		// S.No 121 - WW 118 - B.E. EC - 22EC402
		{HallNo: "WW 118", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC280", "7376241EC289")},

		// S.No 122 - WW 202 - B.E. CS - 22CS402
		{HallNo: "WW 202", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS398", "7376241CS422")},

		// S.No 123 - WW 202 - B.E. EC - 22EC402
		{HallNo: "WW 202", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC290", "7376241EC314")},

		// S.No 124 - WW 203 - B.E. CS - 22CS402
		{HallNo: "WW 203", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS423", "7376241CS437")},

		// S.No 125 - WW 203 - B.E. EC - 22EC402
		{HallNo: "WW 203", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC315", "7376241EC324")},

		// S.No 126 - WW 204 - B.Tech. IT - 22IT402
		{HallNo: "WW 204", CourseCode: "22IT402", RegisterNos: []string{"7376212IT105"}},

		// S.No 127 - WW 204 - 22IT402
		{HallNo: "WW 204", CourseCode: "22IT402", RegisterNos: []string{"7376222IT110"}},

		// S.No 128 - WW 204 - 22IT402
		{HallNo: "WW 204", CourseCode: "22IT402", RegisterNos: []string{
			"7376232IT113", "7376232IT118", "7376232IT122", "7376232IT146",
			"7376232IT152", "7376232IT228", "7376232IT282",
		}},

		// S.No 129 - WW 204 - B.E. CS - 22CS402
		{HallNo: "WW 204", CourseCode: "22CS402", RegisterNos: []string{"7376251CS524"}},

		// S.No 130 - WW 204 - B.E. EC - 22EC402
		{HallNo: "WW 204", CourseCode: "22EC402", RegisterNos: expandRange("7376251EC510", "7376251EC519")},

		// S.No 131 - WW 204 - B.Tech. IT - 22IT402
		{HallNo: "WW 204", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT101", "7376242IT105")},

		// S.No 132 - WW 205 - 22IT402
		{HallNo: "WW 205", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT177", "7376242IT191")},

		// S.No 133 - WW 205 - B.Tech. AD - 22AI402
		{HallNo: "WW 205", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD147", "7376242AD156")},

		// S.No 134 - WW 211 - B.E. CS - 22CS402
		{HallNo: "WW 211", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS438", "7376241CS442")...)
			r = append(r, expandRange("7376241CS444", "7376241CS453")...)
			return r
		}()},

		// S.No 135 - WW 211 - B.E. EC - 22EC402
		{HallNo: "WW 211", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC325", "7376241EC334")},

		// S.No 136 - WW 212 - B.E. CD - 22CD402
		{HallNo: "WW 212", CourseCode: "22CD402", RegisterNos: []string{
			"7376221CD114", "7376221CD126", "7376221CD144", "7376221CD153",
			"7376231CD503",
		}},

		// S.No 137 - WW 212 - B.Tech. TT - 22TT402
		{HallNo: "WW 212", CourseCode: "22TT402", RegisterNos: []string{"7376232TX515"}},

		// S.No 138 - WW 212 - B.E. BM - 22BM402
		{HallNo: "WW 212", CourseCode: "22BM402", RegisterNos: []string{
			"7376231BM107", "7376231BM148", "7376241BM501",
		}},

		// S.No 139 - WW 212 - B.E. CD - 22CD402
		{HallNo: "WW 212", CourseCode: "22CD402", RegisterNos: []string{
			"7376231CD107", "7376231CD111", "7376231CD115", "7376231CD143",
			"7376241CD501", "7376241CD502",
		}},

		// S.No 140 - WW 212 - B.Tech. CT - 22CT402
		{HallNo: "WW 212", CourseCode: "22CT402", RegisterNos: []string{"7376232CT122", "7376242CT503"}},

		// S.No 141 - WW 212 - B.Tech. AG - 22AG402
		{HallNo: "WW 212", CourseCode: "22AG402", RegisterNos: []string{"7376242AG501"}},

		// S.No 142 - WW 212 - 22AG402
		{HallNo: "WW 212", CourseCode: "22AG402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AG106", "7376242AG124")...)
			r = append(r, "7376252AG501", "7376252AG502")
			return r
		}()},

		// S.No 143 - WW 213 - B.Tech. IT - 22IT402
		{HallNo: "WW 213", CourseCode: "22IT402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT151", "7376242IT153")...)
			r = append(r, expandRange("7376242IT155", "7376242IT166")...)
			return r
		}()},

		// S.No 144 - WW 213 - B.Tech. AD - 22AI402
		{HallNo: "WW 213", CourseCode: "22AI402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD126", "7376242AD129")...)
			r = append(r, expandRange("7376242AD131", "7376242AD136")...)
			return r
		}()},

		// S.No 145 - WW 214 - B.Tech. IT - 22IT402
		{HallNo: "WW 214", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT192", "7376242IT206")},

		// S.No 146 - WW 214 - B.Tech. AD - 22AI402
		{HallNo: "WW 214", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD157", "7376242AD166")},

		// S.No 147 - WW 215 - B.Tech. IT - 22IT402
		{HallNo: "WW 215", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT207", "7376242IT221")},

		// S.No 148 - WW 215 - B.Tech. AD - 22AI402
		{HallNo: "WW 215", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD167", "7376242AD176")},

		// S.No 149 - WW 218 - B.Tech. BT - 22BT402
		{HallNo: "WW 218", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT192", "7376242BT206")},

		// S.No 150 - WW 218 - B.Tech. AL - 22AM402
		{HallNo: "WW 218", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL207", "7376242AL216")},

		// S.No 151 - WW 219 - 22AM402
		{HallNo: "WW 219", CourseCode: "22AM402", RegisterNos: []string{"7376242AL501", "7376242AL503"}},

		// S.No 152 - WW 219 - B.Tech. BT - 22BT402
		{HallNo: "WW 219", CourseCode: "22BT402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT207", "7376242BT218")...)
			r = append(r, expandRange("7376242BT220", "7376242BT222")...)
			return r
		}()},

		// S.No 153 - WW 219 - B.Tech. AL - 22AM402
		{HallNo: "WW 219", CourseCode: "22AM402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AL217", "7376242AL223")...)
			r = append(r, "7376252AL501")
			return r
		}()},

		// S.No 154 - WW 222 - B.Tech. CB - 22CB402
		{HallNo: "WW 222", CourseCode: "22CB402", RegisterNos: []string{"7376222CB121"}},

		// S.No 155 - WW 222 - B.E. MZ - 22MC402
		{HallNo: "WW 222", CourseCode: "22MC402", RegisterNos: []string{"7376231MZ106", "7376231MZ111"}},

		// S.No 156 - WW 222 - B.Tech. CB - 22CB402
		{HallNo: "WW 222", CourseCode: "22CB402", RegisterNos: []string{
			"7376232CB106", "7376232CB111", "7376232CB123", "7376232CB133",
		}},

		// S.No 157 - WW 222 - B.E. MZ - 22MC402
		{HallNo: "WW 222", CourseCode: "22MC402", RegisterNos: expandRange("7376241MZ101", "7376241MZ121")},

		// S.No 158 - WW 222 - B.Tech. BT - 22BT402
		{HallNo: "WW 222", CourseCode: "22BT402", RegisterNos: []string{"7376252BT501"}},

		// S.No 159 - WW 222 - B.Tech. CB - 22CB402
		{HallNo: "WW 222", CourseCode: "22CB402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB102", "7376242CB105")...)
			r = append(r, expandRange("7376242CB107", "7376242CB121")...)
			return r
		}()},

		// S.No 160 - WW 222 - B.Tech. AL - 22AM402
		{HallNo: "WW 222", CourseCode: "22AM402", RegisterNos: []string{"7376252AL502", "7376252AL503"}},

		// S.No 161 - WW 223 - B.E. MZ - 22MC402
		{HallNo: "WW 223", CourseCode: "22MC402", RegisterNos: expandRange("7376241MZ122", "7376241MZ146")},

		// S.No 162 - WW 223 - B.Tech. CB - 22CB402
		{HallNo: "WW 223", CourseCode: "22CB402", RegisterNos: expandRange("7376242CB122", "7376242CB146")},

		// S.No 163 - WW 224 - B.E. ME - 22ME402
		{HallNo: "WW 224", CourseCode: "22ME402", RegisterNos: []string{"201ME153"}},

		// S.No 164 - WW 224 - B.E. EI - 22EI402
		{HallNo: "WW 224", CourseCode: "22EI402", RegisterNos: []string{"7376231EI143", "7376231EI159"}},

		// S.No 165 - WW 224 - B.E. MZ - 22MC402
		{HallNo: "WW 224", CourseCode: "22MC402", RegisterNos: []string{"7376241MZ501"}},

		// S.No 166 - WW 224 - B.Tech. CB - 22CB402
		{HallNo: "WW 224", CourseCode: "22CB402", RegisterNos: []string{"7376242CB502"}},

		// S.No 167 - WW 224 - B.E. EI - 22EI402
		{HallNo: "WW 224", CourseCode: "22EI402", RegisterNos: expandRange("7376241EI101", "7376241EI106")},

		// S.No 168 - WW 224 - B.E. ME - 22ME402
		{HallNo: "WW 224", CourseCode: "22ME402", RegisterNos: expandRange("7376241ME102", "7376241ME104")},

		// S.No 169 - WW 224 - B.E. MZ - 22MC402
		{HallNo: "WW 224", CourseCode: "22MC402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241MZ147", "7376241MZ160")...)
			r = append(r, expandRange("7376251MZ501", "7376251MZ506")...)
			return r
		}()},

		// S.No 170 - WW 224 - B.Tech. CB - 22CB402
		{HallNo: "WW 224", CourseCode: "22CB402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB147", "7376242CB159")...)
			r = append(r, expandRange("7376252CB501", "7376252CB503")...)
			return r
		}()},

		// S.No 171 - WW 225 - B.E. EI - 22EI402
		{HallNo: "WW 225", CourseCode: "22EI402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI107", "7376241EI125")...)
			r = append(r, expandRange("7376241EI127", "7376241EI132")...)
			return r
		}()},

		// S.No 172 - WW 225 - B.E. ME - 22ME402
		{HallNo: "WW 225", CourseCode: "22ME402", RegisterNos: expandRange("7376241ME105", "7376241ME129")},

		// S.No 173 - WW 226 - B.E. EI - 22EI402
		{HallNo: "WW 226", CourseCode: "22EI402", RegisterNos: expandRange("7376241EI133", "7376241EI157")},

		// S.No 174 - WW 226 - B.E. ME - 22ME402
		{HallNo: "WW 226", CourseCode: "22ME402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241ME130", "7376241ME132")...)
			r = append(r, expandRange("7376241ME134", "7376241ME155")...)
			return r
		}()},

		// S.No 175 - WW 227 - B.E. CE - 22CE402
		{HallNo: "WW 227", CourseCode: "22CE402", RegisterNos: []string{
			"7376221CE112", "7376221CE123", "7376221CE124", "7376221CE138",
			"7376231CE503",
		}},

		// S.No 176 - WW 227 - B.E. MC - 22MC402
		{HallNo: "WW 227", CourseCode: "22MC402", RegisterNos: []string{"7376231MC506"}},

		// S.No 177 - WW 227 - B.E. SE - 22IS402
		{HallNo: "WW 227", CourseCode: "22IS402", RegisterNos: []string{
			"7376221SE108", "7376221SE134", "7376221SE140",
		}},

		// S.No 178 - WW 227 - B.Tech. FD - 22FD402
		{HallNo: "WW 227", CourseCode: "22FD402", RegisterNos: []string{
			"7376222FD107", "7376222FD121", "7376222FD125",
		}},

		// S.No 179 - WW 227 - B.Tech. AG - 22AG402
		{HallNo: "WW 227", CourseCode: "22AG402", RegisterNos: []string{
			"7376222AG116", "7376222AG120", "7376222AG157", "7376222AG158",
		}},

		// S.No 180 - WW 227 - B.E. CE - 22CE402
		{HallNo: "WW 227", CourseCode: "22CE402", RegisterNos: []string{
			"7376231CE104", "7376231CE108", "7376231CE113", "7376231CE117",
			"7376231CE120", "7376231CE129", "7376241CE501",
		}},

		// S.No 181 - WW 227 - B.E. SE - 22IS402
		{HallNo: "WW 227", CourseCode: "22IS402", RegisterNos: []string{"7376231SE137"}},

		// S.No 182 - WW 227 - B.Tech. AG - 22AG402
		{HallNo: "WW 227", CourseCode: "22AG402", RegisterNos: []string{
			"7376232AG113", "7376232AG129", "7376232AG132", "7376232AG151",
		}},

		// S.No 183 - WW 227 - B.E. EI - 22EI402
		{HallNo: "WW 227", CourseCode: "22EI402", RegisterNos: []string{
			"7376241EI158", "7376241EI159", "7376241EI160",
			"7376251EI501", "7376251EI502",
		}},

		// S.No 184 - WW 227 - B.E. ME - 22ME402
		{HallNo: "WW 227", CourseCode: "22ME402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241ME156", "7376241ME159")...)
			r = append(r, expandRange("7376251ME501", "7376251ME508")...)
			return r
		}()},

		// S.No 185 - WW 227 - B.Tech. AG - 22AG402
		{HallNo: "WW 227", CourseCode: "22AG402", RegisterNos: expandRange("7376242AG101", "7376242AG105")},
	}
}

func buildSeatingDataSession12AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		{HallNo: "EW 101", CourseCode: "22EC304", RegisterNos: []string{
			"7376221EC102",
			"7376221EC107",
			"7376221EC151",
			"7376221EC192",
			"7376221EC226",
			"7376221EC290",
			"7376221EC337",
			"7376231EC101",
			"7376231EC110",
			"7376231EC112",
			"7376231EC121",
			"7376231EC283",
			"7376231EC297",
			"7376231EC305",
			"7376231EC331",
		}},

		{HallNo: "EW 101", CourseCode: "22IT304", RegisterNos: []string{
			"7376222IT110",
			"7376232IT118",
			"7376232IT152",
			"7376232IT282",
			"7376242IT164",
			"7376242IT184",
			"7376242IT214",
			"7376242IT227",
			"7376242IT287",
			"7376252IT506",
		}},

		{HallNo: "EW 102", CourseCode: "22EC304", RegisterNos: []string{
			"7376231EC514",
			"7376231EC334",
			"7376241EC133",
			"7376241EC137",
			"7376241EC144",
			"7376241EC147",
			"7376241EC151",
			"7376241EC160",
			"7376241EC163",
			"7376241EC170",
			"7376241EC246",
			"7376241EC256",
			"7376241EC271",
			"7376241EC279",
			"7376241EC284",
		}},

		{HallNo: "EW 102", CourseCode: "22EE304", RegisterNos: []string{
			"7376241EE130",
			"7376241EE146",
			"7376241EE147",
			"7376241EE157",
			"7376241EE190",
			"7376241EE193",
			"7376251EE502",
		}},

		{HallNo: "EW 102", CourseCode: "22IT304", RegisterNos: []string{
			"7376252IT507",
			"7376252IT511",
			"7376252IT513",
		}},

		{HallNo: "EW 103", CourseCode: "22ME304", RegisterNos: []string{
			"7376221ME111",
			"7376221ME114",
			"7376221ME154",
			"7376231ME121",
			"7376231ME149",
			"7376241ME102",
		}},

		{HallNo: "EW 103", CourseCode: "22EC304", RegisterNos: []string{
			"7376241EC504",
			"7376241EC513",
			"7376241EC515",
			"7376241EC312",
			"7376241EC328",
			"7376241EC334",
			"7376241EC339",
			"7376251EC505",
			"7376251EC506",
			"7376251EC507",
			"7376251EC509",
			"7376251EC511",
			"7376251EC513",
			"7376251EC516",
			"7376251EC519",
		}},

		{HallNo: "EW 103", CourseCode: "22EE304", RegisterNos: []string{
			"7376251EE504",
			"7376251EE506",
			"7376251EE507",
			"7376251EE510",
		}},

		{HallNo: "EW 104", CourseCode: "22CS304", RegisterNos: []string{
			"7376221CS118",
			"7376221CS240",
			"7376221CS275",
			"7376231CS102",
			"7376231CS103",
			"7376231CS190",
			"7376231CS235",
			"7376231CS244",
			"7376231CS259",
			"7376241CS395",
			"7376251CS522",
		}},

		{HallNo: "EW 104", CourseCode: "22CB304", RegisterNos: []string{
			"7376232CB501",
			"7376232CB111",
			"7376232CB123",
			"7376232CB133",
			"7376242CB502",
			"7376242CB116",
			"7376242CB119",
		}},

		{HallNo: "EW 104", CourseCode: "22MC304", RegisterNos: []string{
			"7376231MZ106",
			"7376231MZ111",
			"7376231MZ135",
			"7376241MZ124",
		}},

		{HallNo: "EW 105", CourseCode: "22CE304", RegisterNos: []string{
			"7376221CE124",
			"7376231CE120",
			"7376241CE501",
		}},

		{HallNo: "EW 105", CourseCode: "22AI304", RegisterNos: []string{
			"7376232AD502",
			"7376232AD250",
			"7376242AD137",
			"7376242AD189",
			"7376242AD190",
			"7376242AD320",
			"7376252AD502",
			"7376252AD510",
		}},

		{HallNo: "EW 105", CourseCode: "22AG304", RegisterNos: []string{
			"7376222AG116",
			"7376232AG502",
			"7376232AG151",
			"7376252AG502",
		}},

		{HallNo: "EW 105", CourseCode: "22EI304", RegisterNos: []string{
			"7376241EI104",
		}},

		{HallNo: "EW 105", CourseCode: "22MC304", RegisterNos: []string{
			"7376241MZ127",
			"7376241MZ139",
			"7376241MZ143",
			"7376251MZ504",
			"7376251MZ505",
			"7376251MZ506",
		}},

		{HallNo: "EW 105", CourseCode: "22BT304", RegisterNos: []string{
			"7376242BT113",
		}},

		{HallNo: "EW 105", CourseCode: "22AM304", RegisterNos: []string{
			"7376242AL157",
			"7376242AL207",
		}},

		{HallNo: "EW 106", CourseCode: "22MC304", RegisterNos: []string{
			"7376231MC507",
		}},

		{HallNo: "EW 106", CourseCode: "22IS304", RegisterNos: []string{
			"7376221SE134",
			"7376221SE140",
			"7376231SE144",
		}},

		{HallNo: "EW 106", CourseCode: "22CD304", RegisterNos: []string{
			"7376221CD114",
			"7376221CD144",
			"7376241CD501",
		}},

		{HallNo: "EW 106", CourseCode: "22FD304", RegisterNos: []string{
			"7376222FD107",
			"7376222FD125",
		}},

		{HallNo: "EW 106", CourseCode: "22BM304", RegisterNos: []string{
			"7376231BM107",
			"7376241BM501",
		}},

		{HallNo: "EW 106", CourseCode: "22EI304", RegisterNos: []string{
			"7376251EI502",
		}},

		{HallNo: "EW 106", CourseCode: "22BT304", RegisterNos: []string{
			"7376242BT120",
			"7376242BT138",
			"7376242BT151",
			"7376242BT156",
			"7376252BT501",
		}},
	}
}

// LookupHall returns the hall number for a given register number and course code.
func LookupHall(registerNo, courseCode string) (string, bool) {
	registerNo = strings.TrimSpace(strings.ToUpper(registerNo))
	courseCode = strings.TrimSpace(strings.ToUpper(courseCode))

	allRecords := buildSeatingDataSession11FN()
 allRecords := buildSeatingDataSession11AN()
 allRecords := buildSeatingDataSession12FN()
 allRecords := buildSeatingDataSession12AN()
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