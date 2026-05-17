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

func buildSeatingData23FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. EC - 22OEE01
		{HallNo: "EW 101", CourseCode: "22OEE01", RegisterNos: []string{
			"7376221EC151", "7376221EC192",
		}},

		// S.No 2 - EW 101 - 22OEE01
		{HallNo: "EW 101", CourseCode: "22OEE01", RegisterNos: []string{
			"7376231EC161", "7376231EC171",
			"7376231EC183", "7376231EC186",
			"7376231EC187", "7376231EC189",
			"7376231EC205", "7376231EC208",
		}},

		// S.No 3 - EW 101 - 22OME03
		{HallNo: "EW 101", CourseCode: "22OME03", RegisterNos: []string{
			"7376231EC127", "7376231EC141",
			"7376231EC151", "7376231EC152",
			"7376231EC154", "7376231EC156",
			"7376231EC165", "7376231EC177",
			"7376231EC180", "7376231EC202",
			"7376231EC211", "7376231EC215",
			"7376231EC259", "7376231EC274",
			"7376231EC275",
		}},

		// S.No 4 - EW 102 - 22OEE01
		{HallNo: "EW 102", CourseCode: "22OEE01", RegisterNos: []string{
			"7376231EC219", "7376231EC226",
			"7376231EC227", "7376231EC237",
			"7376231EC238", "7376231EC249",
			"7376231EC315", "7376231EC320",
		}},

		// S.No 5 - EW 102 - 22OME03
		{HallNo: "EW 102", CourseCode: "22OME03", RegisterNos: []string{
			"7376231EC287", "7376231EC290",
			"7376231EC308", "7376231EC319",
			"7376231EC323", "7376231EC325",
		}},

		// S.No 6 - EW 102 - B.E. MZ - 22OME03
		{HallNo: "EW 102", CourseCode: "22OME03", RegisterNos: []string{
			"7376231MZ101", "7376231MZ105",
		}},

		// S.No 7 - EW 102 - B.Tech. AD - 22OBT01
		{HallNo: "EW 102", CourseCode: "22OBT01", RegisterNos: []string{
			"7376232AD121", "7376232AD133",
			"7376232AD136", "7376232AD145",
			"7376232AD148", "7376232AD172",
			"7376232AD217", "7376232AD225",
			"7376232AD232",
		}},

		// S.No 8 - EW 103 - B.E. CS - 22OBT01
		{HallNo: "EW 103", CourseCode: "22OBT01", RegisterNos: []string{
			"7376231CS118", "7376231CS150",
			"7376231CS160", "7376231CS174",
			"7376231CS194", "7376231CS206",
			"7376231CS209",
		}},

		// S.No 9 - EW 103 - B.E. MZ - 22OME03
		{HallNo: "EW 103", CourseCode: "22OME03", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231MZ108", "7376231MZ111",
				"7376231MZ115", "7376231MZ124",
				"7376231MZ136", "7376231MZ146")
			r = append(r, expandRange("7376231MZ153", "7376231MZ155")...)
			r = append(r, "7376231MZ158")
			return r
		}()},

		// S.No 10 - EW 103 - B.Tech. AD - 22OBT01
		{HallNo: "EW 103", CourseCode: "22OBT01", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD248")
			r = append(r, expandRange("7376232AD258", "7376232AD261")...)
			r = append(r, "7376232AD263", "7376232AD264", "7376232AD284")
			return r
		}()},

		// S.No 11 - EW 104 - B.Tech. CT - 22OBT01
		{HallNo: "EW 104", CourseCode: "22OBT01", RegisterNos: []string{
			"7376222CT139",
		}},

		// S.No 12 - EW 104 - B.E. CS - 22OBT01
		{HallNo: "EW 104", CourseCode: "22OBT01", RegisterNos: []string{
			"7376231CS222", "7376231CS228",
			"7376231CS239", "7376231CS249",
			"7376231CS251", "7376231CS265",
			"7376231CS282", "7376231CS304",
			"7376231CS330",
		}},

		// S.No 13 - EW 104 - B.E. MZ - 22OME03
		{HallNo: "EW 104", CourseCode: "22OME03", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241MZ501")
			r = append(r, expandRange("7376241MZ503", "7376241MZ506")...)
			return r
		}()},

		// S.No 14 - EW 104 - B.Tech. CT - 22OBT01
		{HallNo: "EW 104", CourseCode: "22OBT01", RegisterNos: []string{
			"7376232CT106", "7376232CT116",
			"7376232CT119", "7376232CT122",
		}},

		// S.No 15 - EW 104 - B.Tech. AG - 22OME03
		{HallNo: "EW 104", CourseCode: "22OME03", RegisterNos: []string{
			"7376232AG105", "7376232AG113",
			"7376232AG115", "7376232AG120",
			"7376232AG123", "7376232AG125",
		}},

		// S.No 16 - EW 105 - B.E. EI - 22OEE01
		{HallNo: "EW 105", CourseCode: "22OEE01", RegisterNos: []string{
			"7376231EI107", "7376231EI113",
			"7376231EI136", "7376231EI137",
			"7376231EI140", "7376231EI141",
			"7376231EI144", "7376231EI149",
			"7376231EI152",
		}},

		// S.No 17 - EW 105 - B.Tech. IT - 22OBT01
		{HallNo: "EW 105", CourseCode: "22OBT01", RegisterNos: []string{
			"7376232IT156", "7376232IT164",
			"7376232IT168",
		}},

		// S.No 18 - EW 105 - B.Tech. CT - 22OBT01
		{HallNo: "EW 105", CourseCode: "22OBT01", RegisterNos: []string{
			"7376232CT129", "7376232CT130",
			"7376232CT132", "7376232CT149",
			"7376232CT150", "7376232CT156",
			"7376242CT501",
		}},

		// S.No 19 - EW 105 - B.Tech. AG - 22OME03
		{HallNo: "EW 105", CourseCode: "22OME03", RegisterNos: []string{
			"7376232AG128", "7376232AG137",
			"7376232AG141", "7376232AG142",
			"7376232AG149", "7376232AG153",
		}},

		// S.No 20 - EW 106 - B.E. EI - 22OEE01
		{HallNo: "EW 106", CourseCode: "22OEE01", RegisterNos: []string{
			"7376231EI503",
		}},

		// S.No 21 - EW 106 - B.E. CS - 22OEC03
		{HallNo: "EW 106", CourseCode: "22OEC03", RegisterNos: []string{
			"7376231CS102", "7376231CS190",
			"7376231CS235",
		}},

		// S.No 22 - EW 106 - B.E. EE - 22OME03
		{HallNo: "EW 106", CourseCode: "22OME03", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EE134", "7376231EE147",
				"7376231EE151", "7376231EE153",
				"7376231EE157", "7376231EE158")
			r = append(r, expandRange("7376241EE504", "7376241EE506")...)
			return r
		}()},

		// S.No 23 - EW 106 - B.Tech. IT - 22OBT01
		{HallNo: "EW 106", CourseCode: "22OBT01", RegisterNos: []string{
			"7376232IT178", "7376232IT242",
			"7376232IT260", "7376242IT501",
			"7376242IT504", "7376242IT505",
			"7376242IT511",
		}},

		// S.No 24 - EW 106 - B.Tech. CB - 22OBT01
		{HallNo: "EW 106", CourseCode: "22OBT01", RegisterNos: []string{
			"7376232CB101", "7376232CB109",
			"7376232CB116",
		}},

		// S.No 25 - EW 106 - B.E. CS - 22OEC03
		{HallNo: "EW 106", CourseCode: "22OEC03", RegisterNos: []string{
			"7376231CS244", "7376231CS259",
		}},

		// S.No 26 - EW 201 - B.E. BM - 22OBT01
		{HallNo: "EW 201", CourseCode: "22OBT01", RegisterNos: []string{
			"7376231BM501", "7376231BM502",
		}},

		// S.No 27 - EW 201 - B.E. SE - 22OBT01
		{HallNo: "EW 201", CourseCode: "22OBT01", RegisterNos: []string{
			"7376221SE116", "7376221SE157",
		}},

		// S.No 28 - EW 201 - B.E. EE - 22OEC03
		{HallNo: "EW 201", CourseCode: "22OEC03", RegisterNos: []string{
			"7376231EE108", "7376231EE127",
			"7376231EE136", "7376231EE150",
		}},

		// S.No 29 - EW 201 - B.E. EI - 22OME03
		{HallNo: "EW 201", CourseCode: "22OME03", RegisterNos: []string{
			"7376231EI111", "7376231EI160",
		}},

		// S.No 30 - EW 201 - B.E. BM - 22OME03
		{HallNo: "EW 201", CourseCode: "22OME03", RegisterNos: []string{
			"7376231BM124", "7376231BM143",
		}},

		// S.No 31 - EW 201 - B.E. SE - 22OBT01
		{HallNo: "EW 201", CourseCode: "22OBT01", RegisterNos: []string{
			"7376231SE106",
		}},

		// S.No 32 - EW 201 - B.E. MZ - 22OEE01
		{HallNo: "EW 201", CourseCode: "22OEE01", RegisterNos: []string{
			"7376231MZ126",
		}},

		// S.No 33 - EW 201 - B.Tech. CB - 22OBT01
		{HallNo: "EW 201", CourseCode: "22OBT01", RegisterNos: []string{
			"7376232CB118", "7376232CB122",
			"7376232CB124", "7376232CB129",
			"7376232CB143",
		}},

		// S.No 34 - EW 201 - B.Tech. AD - 22OME03
		{HallNo: "EW 201", CourseCode: "22OME03", RegisterNos: []string{
			"7376232AD228",
		}},

		// S.No 35 - EW 201 - B.Tech. AL - 22OBT01
		{HallNo: "EW 201", CourseCode: "22OBT01", RegisterNos: []string{
			"7376232AL124",
		}},

		// S.No 36 - EW 201 - B.E. SE - 22OEC03
		{HallNo: "EW 201", CourseCode: "22OEC03", RegisterNos: []string{
			"7376231SE108", "7376231SE139",
		}},

		// S.No 37 - EW 201 - B.E. MZ - 22OBT01
		{HallNo: "EW 201", CourseCode: "22OBT01", RegisterNos: []string{
			"7376231MZ106",
		}},

		// S.No 38 - EW 201 - B.Tech. CB - 22OBT01
		{HallNo: "EW 201", CourseCode: "22OBT01", RegisterNos: []string{
			"7376232CB123",
		}},

		// S.No 39 - EW 202 - B.E. CS - 22OME03
		{HallNo: "EW 202", CourseCode: "22OME03", RegisterNos: []string{
			"7376221CS275",
		}},

		// S.No 40 - EW 202 - B.E. MC - 22OME03
		{HallNo: "EW 202", CourseCode: "22OME03", RegisterNos: []string{
			"7376231MC506", "7376231MC507",
		}},

		// S.No 41 - EW 202 - B.Tech. IT - 22OME03
		{HallNo: "EW 202", CourseCode: "22OME03", RegisterNos: []string{
			"7376222IT110",
		}},

		// S.No 42 - EW 202 - B.Tech. TT - 22OBT01
		{HallNo: "EW 202", CourseCode: "22OBT01", RegisterNos: []string{
			"7376232TX515",
		}},

		// S.No 43 - EW 202 - B.Tech. AG - 22OBT01
		{HallNo: "EW 202", CourseCode: "22OBT01", RegisterNos: []string{
			"7376222AG158",
		}},

		// S.No 44 - EW 202 - B.E. EC - 22OBT01
		{HallNo: "EW 202", CourseCode: "22OBT01", RegisterNos: []string{
			"7376231EC305", "7376231EC309",
			"7376241EC509",
		}},

		// S.No 45 - EW 202 - B.E. EE - 22OEC03
		{HallNo: "EW 202", CourseCode: "22OEC03", RegisterNos: []string{
			"7376241EE502", "7376241EE503",
		}},

		// S.No 46 - EW 202 - B.E. MZ - 22OEC03
		{HallNo: "EW 202", CourseCode: "22OEC03", RegisterNos: []string{
			"7376231MZ133",
		}},

		// S.No 47 - EW 202 - B.Tech. IT - 22OME03
		{HallNo: "EW 202", CourseCode: "22OME03", RegisterNos: []string{
			"7376232IT103",
		}},

		// S.No 48 - EW 202 - B.Tech. AG - 22OBT01
		{HallNo: "EW 202", CourseCode: "22OBT01", RegisterNos: []string{
			"7376232AG144",
		}},

		// S.No 49 - EW 202 - B.E. EC - 22OBT01
		{HallNo: "EW 202", CourseCode: "22OBT01", RegisterNos: []string{
			"7376231EC283",
		}},

		// S.No 50 - EW 202 - B.Tech. AD - 22OEC03
		{HallNo: "EW 202", CourseCode: "22OEC03", RegisterNos: []string{
			"7376232AD115", "7376232AD226",
			"7376232AD282",
		}},

		// S.No 51 - EW 202 - B.Tech. AL - 22OEC03
		{HallNo: "EW 202", CourseCode: "22OEC03", RegisterNos: []string{
			"7376232AL180", "7376242AL503",
		}},
	}
}

func buildSeatingData23AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. CE - 22CE702
		{HallNo: "EW 101", CourseCode: "22CE702", RegisterNos: []string{
			"7376221CE104", "7376221CE123",
			"7376221CE124", "7376221CE138",
			"7376231CE503",
		}},

		// S.No 2 - EW 101 - B.E. CS - 22CS702
		{HallNo: "EW 101", CourseCode: "22CS702", RegisterNos: []string{
			"7376221CS275", "7376231CS512",
		}},

		// S.No 3 - EW 101 - B.E. EC - 22EC702
		{HallNo: "EW 101", CourseCode: "22EC702", RegisterNos: []string{
			"7376221EC102", "7376221EC107",
			"7376221EC192", "7376221EC290",
		}},

		// S.No 4 - EW 101 - B.E. EE - 22EE702
		{HallNo: "EW 101", CourseCode: "22EE702", RegisterNos: []string{
			"7376221EE136", "7376231EE504",
		}},

		// S.No 5 - EW 101 - B.E. MC - 22MC702
		{HallNo: "EW 101", CourseCode: "22MC702", RegisterNos: []string{
			"7376221MC124", "7376231MC506",
			"7376231MC510",
		}},

		// S.No 6 - EW 101 - B.E. CD - 22CD702
		{HallNo: "EW 101", CourseCode: "22CD702", RegisterNos: []string{
			"7376221CD114", "7376221CD144",
			"7376221CD153", "7376231CD503",
		}},

		// S.No 7 - EW 101 - B.Tech. FD - 22FD702
		{HallNo: "EW 101", CourseCode: "22FD702", RegisterNos: []string{
			"7376222FD107",
		}},

		// S.No 8 - EW 101 - B.Tech. IT - 22IT702
		{HallNo: "EW 101", CourseCode: "22IT702", RegisterNos: []string{
			"7376222IT110", "7376222IT263",
		}},

		// S.No 9 - EW 101 - B.Tech. AG - 22AG702
		{HallNo: "EW 101", CourseCode: "22AG702", RegisterNos: []string{
			"7376222AG120", "7376222AG158",
		}},

		// S.No 10 - EW 102 - B.E. ME - 22ME702
		{HallNo: "EW 102", CourseCode: "22ME702", RegisterNos: []string{
			"7376221ME114", "7376221ME138",
		}},

		// S.No 11 - EW 102 - B.E. BM - 22BM702
		{HallNo: "EW 102", CourseCode: "22BM702", RegisterNos: []string{
			"7376231BM502",
		}},

		// S.No 12 - EW 102 - B.E. SE - 22IS702
		{HallNo: "EW 102", CourseCode: "22IS702", RegisterNos: []string{
			"7376221SE134",
		}},

		// S.No 13 - EW 102 - B.Tech. FD - 22FD702
		{HallNo: "EW 102", CourseCode: "22FD702", RegisterNos: []string{
			"7376222FD125",
		}},

		// S.No 14 - EW 102 - B.Tech. CT - 22CT702
		{HallNo: "EW 102", CourseCode: "22CT702", RegisterNos: []string{
			"7376222CT158",
		}},

		// S.No 15 - EW 102 - B.Tech. AL - 22AM702
		{HallNo: "EW 102", CourseCode: "22AM702", RegisterNos: []string{
			"7376222AL187",
		}},
	}
}

func buildSeatingData18FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. EC - 22EC046
		{HallNo: "EW 101", CourseCode: "22EC046", RegisterNos: []string{
			"7376221EC107", "7376221EC116", "7376221EC192", "7376221EC226",
		}},

		// S.No 2 - EW 101 - 22EC046
		{HallNo: "EW 101", CourseCode: "22EC046", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC101", "7376231EC103")
			r = append(r, expandRange("7376231EC105", "7376231EC108")...)
			r = append(r, expandRange("7376231EC110", "7376231EC113")...)
			r = append(r, "7376231EC115")
			return r
		}()},

		// S.No 3 - EW 101 - B.Tech. AD - 22AI049
		{HallNo: "EW 101", CourseCode: "22AI049", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD101", "7376232AD102")
			r = append(r, expandRange("7376232AD104", "7376232AD111")...)
			return r
		}()},

		// S.No 4 - EW 102 - B.E. EC - 22EC046
		{HallNo: "EW 102", CourseCode: "22EC046", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC116", "7376231EC119", "7376231EC122")
			r = append(r, expandRange("7376231EC126", "7376231EC128")...)
			r = append(r, "7376231EC130")
			r = append(r, expandRange("7376231EC133", "7376231EC135")...)
			r = append(r, "7376231EC137", "7376231EC139", "7376231EC140", "7376231EC143", "7376231EC144")
			return r
		}()},

		// S.No 5 - EW 102 - B.Tech. AD - 22AI049
		{HallNo: "EW 102", CourseCode: "22AI049", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD113", "7376232AD115")
			r = append(r, expandRange("7376232AD119", "7376232AD123")...)
			r = append(r, "7376232AD127", "7376232AD131", "7376232AD132")
			return r
		}()},

		// S.No 6 - EW 103 - B.E. EC - 22EC046
		{HallNo: "EW 103", CourseCode: "22EC046", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC169", "7376231EC172", "7376231EC174", "7376231EC176", "7376231EC177")
			r = append(r, expandRange("7376231EC179", "7376231EC182")...)
			r = append(r, "7376231EC187", "7376231EC190", "7376231EC191", "7376231EC193", "7376231EC194", "7376231EC196")
			return r
		}()},

		// S.No 7 - EW 103 - B.Tech. AD - 22AI049
		{HallNo: "EW 103", CourseCode: "22AI049", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AD146", "7376232AD150")...)
			r = append(r, expandRange("7376232AD152", "7376232AD155")...)
			r = append(r, "7376232AD158")
			return r
		}()},

		// S.No 8 - EW 104 - B.E. EC - 22EC046
		{HallNo: "EW 104", CourseCode: "22EC046", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC265")
			r = append(r, expandRange("7376231EC267", "7376231EC269")...)
			r = append(r, "7376231EC271", "7376231EC272")
			r = append(r, expandRange("7376231EC274", "7376231EC279")...)
			r = append(r, "7376231EC281", "7376231EC285", "7376231EC287")
			return r
		}()},

		// S.No 9 - EW 104 - B.Tech. AD - 22AI049
		{HallNo: "EW 104", CourseCode: "22AI049", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD204", "7376232AD206")
			r = append(r, expandRange("7376232AD208", "7376232AD210")...)
			r = append(r, expandRange("7376232AD212", "7376232AD216")...)
			return r
		}()},

		// S.No 10 - EW 105 - B.E. EC - 22EC046
		{HallNo: "EW 105", CourseCode: "22EC046", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC289", "7376231EC291")...)
			r = append(r, "7376231EC293", "7376231EC294")
			r = append(r, expandRange("7376231EC296", "7376231EC304")...)
			r = append(r, "7376231EC306")
			return r
		}()},

		// S.No 11 - EW 105 - B.Tech. AD - 22AI049
		{HallNo: "EW 105", CourseCode: "22AI049", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD217", "7376232AD219", "7376232AD221", "7376232AD222")
			r = append(r, expandRange("7376232AD224", "7376232AD228")...)
			r = append(r, "7376232AD230")
			return r
		}()},

		// S.No 12 - EW 106 - B.E. EC - 22EC015
		{HallNo: "EW 106", CourseCode: "22EC015", RegisterNos: []string{"7376221EC102"}},

		// S.No 13 - EW 106 - B.E. CS - 22CS035
		{HallNo: "EW 106", CourseCode: "22CS035", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS123", "7376231CS125")...)
			r = append(r, expandRange("7376231CS127", "7376231CS129")...)
			r = append(r, "7376231CS135", "7376231CS136", "7376231CS138", "7376231CS141", "7376231CS142", "7376231CS145", "7376231CS146", "7376231CS149", "7376231CS150")
			return r
		}()},

		// S.No 14 - EW 106 - B.E. EC - 22EC015
		{HallNo: "EW 106", CourseCode: "22EC015", RegisterNos: []string{"7376231EC102"}},

		// S.No 15 - EW 106 - B.Tech. AD - 22AI049
		{HallNo: "EW 106", CourseCode: "22AI049", RegisterNos: expandRange("7376242AD503", "7376242AD510")},

		// S.No 16 - EW 107 - B.E. EC - 22EC046
		{HallNo: "EW 107", CourseCode: "22EC046", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC145", "7376231EC147", "7376231EC148", "7376231EC150", "7376231EC152")
			r = append(r, expandRange("7376231EC155", "7376231EC157")...)
			r = append(r, expandRange("7376231EC159", "7376231EC161")...)
			r = append(r, expandRange("7376231EC163", "7376231EC165")...)
			r = append(r, "7376231EC167")
			return r
		}()},

		// S.No 17 - EW 107 - B.Tech. AD - 22AI049
		{HallNo: "EW 107", CourseCode: "22AI049", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AD133", "7376232AD135")...)
			r = append(r, expandRange("7376232AD137", "7376232AD142")...)
			r = append(r, "7376232AD145")
			return r
		}()},

		// S.No 18 - EW 108 - B.E. EC - 22EC046
		{HallNo: "EW 108", CourseCode: "22EC046", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC198", "7376231EC199", "7376231EC201", "7376231EC206", "7376231EC207", "7376231EC210", "7376231EC211")
			r = append(r, expandRange("7376231EC213", "7376231EC219")...)
			r = append(r, "7376231EC221")
			return r
		}()},

		// S.No 19 - EW 108 - B.Tech. AD - 22AI049
		{HallNo: "EW 108", CourseCode: "22AI049", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD159", "7376232AD163", "7376232AD164", "7376232AD166", "7376232AD168", "7376232AD170", "7376232AD171")
			r = append(r, expandRange("7376232AD173", "7376232AD175")...)
			return r
		}()},

		// S.No 20 - EW 109 - B.E. EC - 22EC046
		{HallNo: "EW 109", CourseCode: "22EC046", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC223", "7376231EC225")...)
			r = append(r, "7376231EC228", "7376231EC229")
			r = append(r, expandRange("7376231EC231", "7376231EC236")...)
			r = append(r, "7376231EC238", "7376231EC239", "7376231EC241", "7376231EC243")
			return r
		}()},

		// S.No 21 - EW 109 - B.Tech. AD - 22AI049
		{HallNo: "EW 109", CourseCode: "22AI049", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD177", "7376232AD178")
			r = append(r, expandRange("7376232AD180", "7376232AD186")...)
			r = append(r, "7376232AD189")
			return r
		}()},

		// S.No 22 - EW 111 - B.E. EC - 22EC046
		{HallNo: "EW 111", CourseCode: "22EC046", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC244", "7376231EC246", "7376231EC247")
			r = append(r, expandRange("7376231EC250", "7376231EC259")...)
			r = append(r, "7376231EC261", "7376231EC262")
			return r
		}()},

		// S.No 23 - EW 111 - B.Tech. AD - 22AI049
		{HallNo: "EW 111", CourseCode: "22AI049", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD190", "7376232AD191", "7376232AD194")
			r = append(r, expandRange("7376232AD196", "7376232AD202")...)
			return r
		}()},

		// S.No 24 - EW 112 - B.E. EC - 22EC046
		{HallNo: "EW 112", CourseCode: "22EC046", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC307", "7376231EC310")...)
			r = append(r, expandRange("7376231EC312", "7376231EC314")...)
			r = append(r, "7376231EC316", "7376231EC317", "7376231EC319")
			r = append(r, expandRange("7376231EC321", "7376231EC323")...)
			r = append(r, "7376231EC325", "7376231EC326")
			return r
		}()},

		// S.No 25 - EW 112 - B.Tech. AD - 22AI049
		{HallNo: "EW 112", CourseCode: "22AI049", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AD231", "7376232AD233")...)
			r = append(r, "7376232AD236")
			r = append(r, expandRange("7376232AD238", "7376232AD240")...)
			r = append(r, "7376232AD243", "7376232AD245", "7376232AD247")
			return r
		}()},

		// S.No 26 - EW 113 - B.Tech. BT - 22BT042
		{HallNo: "EW 113", CourseCode: "22BT042", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT116", "7376232BT120")...)
			r = append(r, "7376232BT122")
			r = append(r, expandRange("7376232BT125", "7376232BT127")...)
			r = append(r, "7376232BT129")
			return r
		}()},

		// S.No 27 - EW 113 - B.Tech. IT - 22IT019
		{HallNo: "EW 113", CourseCode: "22IT019", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT262", "7376232IT267", "7376232IT270", "7376232IT274", "7376232IT275", "7376232IT278")
			r = append(r, expandRange("7376242IT501", "7376242IT505")...)
			r = append(r, expandRange("7376242IT507", "7376242IT510")...)
			return r
		}()},

		// S.No 28 - EW 114 - B.Tech. BT - 22BT042
		{HallNo: "EW 114", CourseCode: "22BT042", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT193", "7376232BT196")...)
			r = append(r, "7376232BT198", "7376232BT200", "7376232BT202")
			r = append(r, expandRange("7376232BT205", "7376232BT207")...)
			return r
		}()},

		// S.No 29 - EW 114 - B.Tech. CT - 22CT019
		{HallNo: "EW 114", CourseCode: "22CT019", RegisterNos: expandRange("7376232CT101", "7376232CT106")},

		// S.No 30 - EW 114 - B.Tech. AD - 22AI020
		{HallNo: "EW 114", CourseCode: "22AI020", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD268", "7376232AD270", "7376232AD272")
			r = append(r, expandRange("7376232AD274", "7376232AD276")...)
			r = append(r, "7376232AD281", "7376232AD282", "7376232AD285")
			return r
		}()},

		// S.No 31 - EW 115 - B.Tech. CB - 22CB008
		{HallNo: "EW 115", CourseCode: "22CB008", RegisterNos: expandRange("7376232CB120", "7376232CB129")},

		// S.No 32 - EW 115 - B.Tech. CT - 22CT019
		{HallNo: "EW 115", CourseCode: "22CT019", RegisterNos: expandRange("7376232CT132", "7376232CT146")},

		// S.No 33 - EW 116 - B.Tech. CB - 22CB008
		{HallNo: "EW 116", CourseCode: "22CB008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB130", "7376232CB137")...)
			r = append(r, "7376232CB139", "7376232CB140")
			return r
		}()},

		// S.No 34 - EW 116 - B.Tech. CT - 22CT019
		{HallNo: "EW 116", CourseCode: "22CT019", RegisterNos: expandRange("7376232CT147", "7376232CT161")},

		// S.No 35 - EW 117 - B.E. ME - 22ME010
		{HallNo: "EW 117", CourseCode: "22ME010", RegisterNos: expandRange("7376231ME111", "7376231ME125")},

		// S.No 36 - EW 117 - B.Tech. CB - 22CB008
		{HallNo: "EW 117", CourseCode: "22CB008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB151", "7376232CB157")...)
			r = append(r, expandRange("7376232CB159", "7376232CB161")...)
			return r
		}()},

		// S.No 37 - EW 118 - B.E. EE - 22EE020
		{HallNo: "EW 118", CourseCode: "22EE020", RegisterNos: expandRange("7376231EE106", "7376231EE115")},

		// S.No 38 - EW 118 - B.E. ME - 22ME010
		{HallNo: "EW 118", CourseCode: "22ME010", RegisterNos: expandRange("7376231ME141", "7376231ME155")},

		// S.No 39 - EW 201 - B.E. CS - 22CS035
		{HallNo: "EW 201", CourseCode: "22CS035", RegisterNos: []string{
			"7376231CS190", "7376231CS193", "7376231CS194", "7376231CS203", "7376231CS204",
			"7376231CS206", "7376231CS207", "7376231CS211", "7376231CS212", "7376231CS214",
			"7376231CS216", "7376231CS220", "7376231CS222", "7376231CS223", "7376231CS225",
		}},

		// S.No 40 - EW 201 - B.E. EC - 22EC015
		{HallNo: "EW 201", CourseCode: "22EC015", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC129", "7376231EC131", "7376231EC132", "7376231EC136", "7376231EC138",
				"7376231EC141", "7376231EC142", "7376231EC146", "7376231EC149", "7376231EC151")
			return r
		}()},

		// S.No 41 - EW 202 - B.E. CS - 22CS035
		{HallNo: "EW 202", CourseCode: "22CS035", RegisterNos: []string{
			"7376231CS264", "7376231CS268", "7376231CS270", "7376231CS273", "7376231CS274",
			"7376231CS276", "7376231CS278", "7376231CS282", "7376231CS284", "7376231CS286",
			"7376231CS289", "7376231CS293", "7376231CS294", "7376231CS296", "7376231CS304",
		}},

		// S.No 42 - EW 202 - B.E. EC - 22EC015
		{HallNo: "EW 202", CourseCode: "22EC015", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC178")
			r = append(r, expandRange("7376231EC183", "7376231EC186")...)
			r = append(r, "7376231EC188", "7376231EC189", "7376231EC192", "7376231EC195", "7376231EC197")
			return r
		}()},

		// S.No 43 - EW 203 - B.Tech. BT - 22BT042
		{HallNo: "EW 203", CourseCode: "22BT042", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT130", "7376232BT132")
			r = append(r, expandRange("7376232BT135", "7376232BT137")...)
			r = append(r, expandRange("7376232BT139", "7376232BT143")...)
			return r
		}()},

		// S.No 44 - EW 203 - B.Tech. IT - 22IT019
		{HallNo: "EW 203", CourseCode: "22IT019", RegisterNos: []string{"7376242IT511"}},

		// S.No 45 - EW 203 - B.Tech. AD - 22AI020
		{HallNo: "EW 203", CourseCode: "22AI020", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD103", "7376232AD112", "7376232AD114")
			r = append(r, expandRange("7376232AD116", "7376232AD118")...)
			r = append(r, expandRange("7376232AD124", "7376232AD126")...)
			r = append(r, expandRange("7376232AD128", "7376232AD130")...)
			r = append(r, "7376232AD136", "7376232AD143")
			return r
		}()},

		// S.No 46 - EW 206 - B.Tech. CB - 22CB008
		{HallNo: "EW 206", CourseCode: "22CB008", RegisterNos: []string{"7376222CB121"}},

		// S.No 47 - EW 206 - B.Tech. BT - 22BT042
		{HallNo: "EW 206", CourseCode: "22BT042", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT209", "7376232BT211")...)
			r = append(r, "7376232BT213", "7376232BT214")
			return r
		}()},

		// S.No 48 - EW 206 - B.Tech. CB - 22CB008
		{HallNo: "EW 206", CourseCode: "22CB008", RegisterNos: expandRange("7376232CB101", "7376232CB119")},

		// S.No 49 - EW 206 - B.Tech. CT - 22CT019
		{HallNo: "EW 206", CourseCode: "22CT019", RegisterNos: expandRange("7376232CT107", "7376232CT131")},

		// S.No 50 - EW 207 - B.E. CS - 22CS035
		{HallNo: "EW 207", CourseCode: "22CS035", RegisterNos: []string{"7376221CS109"}},

		// S.No 51 - EW 207 - 22CS035
		{HallNo: "EW 207", CourseCode: "22CS035", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS102")
			r = append(r, expandRange("7376231CS106", "7376231CS109")...)
			r = append(r, expandRange("7376231CS114", "7376231CS118")...)
			r = append(r, expandRange("7376231CS120", "7376231CS122")...)
			return r
		}()},

		// S.No 52 - EW 207 - B.E. EC - 22EC046
		{HallNo: "EW 207", CourseCode: "22EC046", RegisterNos: []string{"7376241EC521"}},

		// S.No 53 - EW 207 - B.Tech. AD - 22AI049
		{HallNo: "EW 207", CourseCode: "22AI049", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD273")
			r = append(r, expandRange("7376232AD277", "7376232AD280")...)
			r = append(r, "7376232AD283", "7376232AD284", "7376232AD286", "7376242AD501", "7376242AD502")
			return r
		}()},

		// S.No 54 - EW 208 - B.E. CS - 22CS035
		{HallNo: "EW 208", CourseCode: "22CS035", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS152", "7376231CS154")...)
			r = append(r, expandRange("7376231CS159", "7376231CS161")...)
			r = append(r, expandRange("7376231CS164", "7376231CS166")...)
			r = append(r, "7376231CS173", "7376231CS174", "7376231CS176", "7376231CS181", "7376231CS182", "7376231CS189")
			return r
		}()},

		// S.No 55 - EW 208 - B.E. EC - 22EC015
		{HallNo: "EW 208", CourseCode: "22EC015", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC104", "7376231EC109", "7376231EC114", "7376231EC117", "7376231EC118", "7376231EC120", "7376231EC121")
			r = append(r, expandRange("7376231EC123", "7376231EC125")...)
			return r
		}()},

		// S.No 56 - EW 209 - B.E. CS - 22CS035
		{HallNo: "EW 209", CourseCode: "22CS035", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS228", "7376231CS231")...)
			r = append(r, "7376231CS234", "7376231CS235")
			r = append(r, expandRange("7376231CS237", "7376231CS241")...)
			r = append(r, "7376231CS249", "7376231CS252", "7376231CS253", "7376231CS258")
			return r
		}()},

		// S.No 57 - EW 209 - B.E. EC - 22EC015
		{HallNo: "EW 209", CourseCode: "22EC015", RegisterNos: []string{
			"7376231EC153", "7376231EC154", "7376231EC158", "7376231EC162",
			"7376231EC166", "7376231EC168", "7376231EC170", "7376231EC171",
			"7376231EC173", "7376231EC175",
		}},

		// S.No 58 - EW 212 - 22EC015
		{HallNo: "EW 212", CourseCode: "22EC015", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC288", "7376231EC292", "7376231EC295", "7376231EC305", "7376231EC311",
				"7376231EC315", "7376231EC318", "7376231EC320", "7376231EC324")
			r = append(r, expandRange("7376241EC502", "7376241EC504")...)
			r = append(r, expandRange("7376241EC506", "7376241EC510")...)
			r = append(r, "7376241EC512", "7376241EC513", "7376241EC515")
			r = append(r, expandRange("7376241EC518", "7376241EC520")...)
			r = append(r, "7376241EC522")
			return r
		}()},

		// S.No 59 - EW 212 - B.Tech. BT - 22BT042
		{HallNo: "EW 212", CourseCode: "22BT042", RegisterNos: []string{"7376232BT102"}},

		// S.No 60 - EW 212 - B.Tech. IT - 22IT019
		{HallNo: "EW 212", CourseCode: "22IT019", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT153", "7376232IT156", "7376232IT162", "7376232IT164", "7376232IT165",
				"7376232IT168", "7376232IT170", "7376232IT172", "7376232IT178", "7376232IT179",
				"7376232IT181", "7376232IT188", "7376232IT191", "7376232IT192", "7376232IT196", "7376232IT197",
				"7376232IT201")
			r = append(r, expandRange("7376232IT205", "7376232IT210")...)
			r = append(r, "7376232IT216", "7376232IT218")
			return r
		}()},

		// S.No 61 - EW 213 - B.E. EE - 22EE020
		{HallNo: "EW 213", CourseCode: "22EE020", RegisterNos: expandRange("7376231EE116", "7376231EE125")},

		// S.No 62 - EW 213 - B.E. ME - 22ME010
		{HallNo: "EW 213", CourseCode: "22ME010", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231ME156", "7376231ME161")...)
			r = append(r, expandRange("7376241ME501", "7376241ME505")...)
			return r
		}()},

		// S.No 63 - EW 213 - B.E. MZ - 22MC007
		{HallNo: "EW 213", CourseCode: "22MC007", RegisterNos: expandRange("7376231MZ101", "7376231MZ104")},

		// S.No 64 - EW 214 - B.E. EE - 22EE020
		{HallNo: "EW 214", CourseCode: "22EE020", RegisterNos: expandRange("7376231EE126", "7376231EE135")},

		// S.No 65 - EW 214 - B.E. MZ - 22MC007
		{HallNo: "EW 214", CourseCode: "22MC007", RegisterNos: expandRange("7376231MZ105", "7376231MZ119")},

		// S.No 66 - EW 215 - B.E. EE - 22EE020
		{HallNo: "EW 215", CourseCode: "22EE020", RegisterNos: expandRange("7376231EE136", "7376231EE145")},

		// S.No 67 - EW 215 - B.E. MZ - 22MC007
		{HallNo: "EW 215", CourseCode: "22MC007", RegisterNos: expandRange("7376231MZ120", "7376231MZ134")},

		// S.No 68 - EW 218 - B.E. EE - 22EE020
		{HallNo: "EW 218", CourseCode: "22EE020", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EE146", "7376231EE161")...)
			r = append(r, expandRange("7376241EE501", "7376241EE506")...)
			return r
		}()},

		// S.No 69 - EW 218 - B.E. EI - 22EI016
		{HallNo: "EW 218", CourseCode: "22EI016", RegisterNos: expandRange("7376231EI101", "7376231EI103")},

		// S.No 70 - EW 218 - B.E. MZ - 22MC007
		{HallNo: "EW 218", CourseCode: "22MC007", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231MZ135", "7376231MZ158")...)
			r = append(r, "7376241MZ501")
			return r
		}()},

		// S.No 71 - WW 005 - B.Tech. BT - 22BT042
		{HallNo: "WW 005", CourseCode: "22BT042", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT103", "7376232BT106")...)
			r = append(r, "7376232BT108", "7376232BT109", "7376232BT111")
			r = append(r, expandRange("7376232BT113", "7376232BT115")...)
			return r
		}()},

		// S.No 72 - WW 005 - B.Tech. IT - 22IT019
		{HallNo: "WW 005", CourseCode: "22IT019", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT224", "7376232IT226", "7376232IT231")
			r = append(r, expandRange("7376232IT233", "7376232IT236")...)
			r = append(r, "7376232IT240", "7376232IT246", "7376232IT248", "7376232IT249", "7376232IT251",
				"7376232IT254", "7376232IT255", "7376232IT261")
			return r
		}()},

		// S.No 73 - WW 006 - B.Tech. BT - 22BT042
		{HallNo: "WW 006", CourseCode: "22BT042", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT144", "7376232BT146")...)
			r = append(r, "7376232BT148", "7376232BT149", "7376232BT151")
			r = append(r, expandRange("7376232BT154", "7376232BT157")...)
			return r
		}()},

		// S.No 74 - WW 006 - B.Tech. AD - 22AI020
		{HallNo: "WW 006", CourseCode: "22AI020", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD144", "7376232AD151", "7376232AD156", "7376232AD157")
			r = append(r, expandRange("7376232AD160", "7376232AD162")...)
			r = append(r, "7376232AD165", "7376232AD167", "7376232AD169", "7376232AD172", "7376232AD176",
				"7376232AD179", "7376232AD187", "7376232AD188")
			return r
		}()},

		// S.No 75 - WW 007 - B.Tech. BT - 22BT042
		{HallNo: "WW 007", CourseCode: "22BT042", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT159", "7376232BT161")...)
			r = append(r, "7376232BT164")
			r = append(r, expandRange("7376232BT167", "7376232BT171")...)
			r = append(r, "7376232BT174")
			return r
		}()},

		// S.No 76 - WW 007 - B.Tech. AD - 22AI020
		{HallNo: "WW 007", CourseCode: "22AI020", RegisterNos: []string{
			"7376232AD192", "7376232AD193", "7376232AD195", "7376232AD203", "7376232AD205",
			"7376232AD207", "7376232AD211", "7376232AD218", "7376232AD220", "7376232AD223",
			"7376232AD229", "7376232AD234", "7376232AD235", "7376232AD237", "7376232AD241",
		}},

		// S.No 77 - WW 008 - B.Tech. BT - 22BT042
		{HallNo: "WW 008", CourseCode: "22BT042", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT175", "7376232BT179")
			r = append(r, expandRange("7376232BT181", "7376232BT183")...)
			r = append(r, "7376232BT185", "7376232BT187")
			r = append(r, expandRange("7376232BT189", "7376232BT191")...)
			return r
		}()},

		// S.No 78 - WW 008 - B.Tech. AD - 22AI020
		{HallNo: "WW 008", CourseCode: "22AI020", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD242", "7376232AD244", "7376232AD246", "7376232AD250", "7376232AD251",
				"7376232AD254", "7376232AD256", "7376232AD257")
			r = append(r, expandRange("7376232AD259", "7376232AD262")...)
			r = append(r, "7376232AD264", "7376232AD266", "7376232AD267")
			return r
		}()},

		// S.No 79 - WW 011 - B.Tech. CT - 22CT019
		{HallNo: "WW 011", CourseCode: "22CT019", RegisterNos: []string{"7376232CT501"}},

		// S.No 80 - WW 011 - B.E. ME - 22ME010
		{HallNo: "WW 011", CourseCode: "22ME010", RegisterNos: expandRange("7376231ME101", "7376231ME110")},

		// S.No 81 - WW 011 - B.Tech. CB - 22CB008
		{HallNo: "WW 011", CourseCode: "22CB008", RegisterNos: expandRange("7376232CB141", "7376232CB150")},

		// S.No 82 - WW 011 - B.Tech. CT - 22CT019
		{HallNo: "WW 011", CourseCode: "22CT019", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CT162")
			r = append(r, expandRange("7376242CT501", "7376242CT503")...)
			return r
		}()},

		// S.No 83 - WW 012 - B.Tech. CB - 22CB008
		{HallNo: "WW 012", CourseCode: "22CB008", RegisterNos: []string{"7376232CB501", "7376232CB504"}},

		// S.No 84 - WW 012 - B.E. EE - 22EE020
		{HallNo: "WW 012", CourseCode: "22EE020", RegisterNos: expandRange("7376231EE102", "7376231EE105")},

		// S.No 85 - WW 012 - B.E. ME - 22ME010
		{HallNo: "WW 012", CourseCode: "22ME010", RegisterNos: expandRange("7376231ME126", "7376231ME140")},

		// S.No 86 - WW 012 - B.Tech. CB - 22CB008
		{HallNo: "WW 012", CourseCode: "22CB008", RegisterNos: []string{
			"7376232CB162", "7376232CB163", "7376242CB502", "7376242CB503",
		}},

		// S.No 87 - WW 211 - B.E. EC - 22EC046
		{HallNo: "WW 211", CourseCode: "22EC046", RegisterNos: []string{"7376231EC514"}},

		// S.No 88 - WW 211 - 22EC046
		{HallNo: "WW 211", CourseCode: "22EC046", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC327", "7376231EC334")...)
			r = append(r, "7376241EC501", "7376241EC505", "7376241EC511", "7376241EC514", "7376241EC516", "7376241EC517")
			return r
		}()},

		// S.No 89 - WW 211 - B.Tech. AD - 22AI049
		{HallNo: "WW 211", CourseCode: "22AI049", RegisterNos: []string{
			"7376232AD248", "7376232AD249", "7376232AD252", "7376232AD253", "7376232AD255",
			"7376232AD258", "7376232AD263", "7376232AD265", "7376232AD269", "7376232AD271",
		}},

		// S.No 90 - WW 212 - B.Tech. BT - 22BT036
		{HallNo: "WW 212", CourseCode: "22BT036", RegisterNos: []string{
			"7376232BT203", "7376232BT204", "7376232BT208", "7376232BT212", "7376232BT215",
		}},

		// S.No 91 - WW 212 - B.Tech. FT - 22FT007
		{HallNo: "WW 212", CourseCode: "22FT007", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FT101", "7376232FT106")...)
			r = append(r, expandRange("7376232FT108", "7376232FT120")...)
			r = append(r, "7376242FT501")
			return r
		}()},

		// S.No 92 - WW 213 - B.E. CS - 22CS035
		{HallNo: "WW 213", CourseCode: "22CS035", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS305", "7376231CS307", "7376231CS309", "7376231CS311", "7376231CS315",
				"7376231CS316", "7376231CS318", "7376231CS320", "7376231CS323", "7376231CS325")
			r = append(r, expandRange("7376231CS328", "7376231CS330")...)
			r = append(r, "7376231CS335", "7376231CS337")
			return r
		}()},

		// S.No 93 - WW 213 - B.E. EC - 22EC015
		{HallNo: "WW 213", CourseCode: "22EC015", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC200")
			r = append(r, expandRange("7376231EC202", "7376231EC205")...)
			r = append(r, "7376231EC208", "7376231EC209", "7376231EC212", "7376231EC220", "7376231EC222")
			return r
		}()},

		// S.No 94 - WW 214 - B.Tech. IT - 22IT019
		{HallNo: "WW 214", CourseCode: "22IT019", RegisterNos: []string{"7376212IT105"}},

		// S.No 95 - WW 214 - B.E. CS - 22CS035
		{HallNo: "WW 214", CourseCode: "22CS035", RegisterNos: []string{
			"7376231CS338", "7376231CS353", "7376241CS507", "7376241CS510", "7376241CS518", "7376241CS519",
		}},

		// S.No 96 - WW 214 - B.E. EC - 22EC015
		{HallNo: "WW 214", CourseCode: "22EC015", RegisterNos: []string{
			"7376231EC226", "7376231EC227", "7376231EC230", "7376231EC237", "7376231EC240",
			"7376231EC242", "7376231EC245", "7376231EC248", "7376231EC249", "7376231EC260",
		}},

		// S.No 97 - WW 214 - B.Tech. IT - 22IT019
		{HallNo: "WW 214", CourseCode: "22IT019", RegisterNos: []string{
			"7376232IT107", "7376232IT112", "7376232IT113", "7376232IT115",
			"7376232IT117", "7376232IT118", "7376232IT120", "7376232IT121",
		}},

		// S.No 98 - WW 215 - B.E. EC - 22EC015
		{HallNo: "WW 215", CourseCode: "22EC015", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC263", "7376231EC264", "7376231EC266", "7376231EC270", "7376231EC273",
				"7376231EC280")
			r = append(r, expandRange("7376231EC282", "7376231EC284")...)
			r = append(r, "7376231EC286")
			return r
		}()},

		// S.No 99 - WW 215 - B.Tech. IT - 22IT019
		{HallNo: "WW 215", CourseCode: "22IT019", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT122", "7376232IT125")...)
			r = append(r, expandRange("7376232IT130", "7376232IT132")...)
			r = append(r, "7376232IT134")
			r = append(r, expandRange("7376232IT137", "7376232IT139")...)
			r = append(r, expandRange("7376232IT146", "7376232IT148")...)
			r = append(r, "7376232IT150")
			return r
		}()},

		// S.No 100 - WW 218 - B.E. EI - 22EI016
		{HallNo: "WW 218", CourseCode: "22EI016", RegisterNos: expandRange("7376231EI104", "7376231EI113")},

		// S.No 101 - WW 218 - B.E. SE - 22IS013
		{HallNo: "WW 218", CourseCode: "22IS013", RegisterNos: expandRange("7376231SE101", "7376231SE110")},

		// S.No 102 - WW 218 - B.E. MZ - 22MC007
		{HallNo: "WW 218", CourseCode: "22MC007", RegisterNos: expandRange("7376241MZ502", "7376241MZ506")},

		// S.No 103 - WW 219 - B.E. EI - 22EI016
		{HallNo: "WW 219", CourseCode: "22EI016", RegisterNos: expandRange("7376231EI114", "7376231EI123")},

		// S.No 104 - WW 219 - B.E. SE - 22IS013
		{HallNo: "WW 219", CourseCode: "22IS013", RegisterNos: expandRange("7376231SE111", "7376231SE125")},

		// S.No 105 - WW 222 - B.E. EI - 22EI016
		{HallNo: "WW 222", CourseCode: "22EI016", RegisterNos: expandRange("7376231EI124", "7376231EI148")},

		// S.No 106 - WW 222 - B.E. SE - 22IS013
		{HallNo: "WW 222", CourseCode: "22IS013", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE126", "7376231SE143")...)
			r = append(r, expandRange("7376231SE145", "7376231SE151")...)
			return r
		}()},

		// S.No 107 - WW 223 - B.Tech. AG - 22AG008
		{HallNo: "WW 223", CourseCode: "22AG008", RegisterNos: []string{
			"7376222AG109", "7376222AG116", "7376222AG120", "7376222AG157", "7376222AG158",
		}},

		// S.No 108 - WW 223 - B.E. EI - 22EI016
		{HallNo: "WW 223", CourseCode: "22EI016", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EI149", "7376231EI160")...)
			r = append(r, expandRange("7376241EI501", "7376241EI504")...)
			return r
		}()},

		// S.No 109 - WW 223 - B.E. BM - 22BM005
		{HallNo: "WW 223", CourseCode: "22BM005", RegisterNos: expandRange("7376231BM101", "7376231BM120")},

		// S.No 110 - WW 223 - B.E. SE - 22IS013
		{HallNo: "WW 223", CourseCode: "22IS013", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE152", "7376231SE155")...)
			r = append(r, "7376241SE501")
			return r
		}()},

		// S.No 111 - WW 223 - B.Tech. AG - 22AG008
		{HallNo: "WW 223", CourseCode: "22AG008", RegisterNos: expandRange("7376232AG102", "7376232AG105")},

		// S.No 112 - WW 224 - B.E. BM - 22BM005
		{HallNo: "WW 224", CourseCode: "22BM005", RegisterNos: expandRange("7376231BM121", "7376231BM145")},

		// S.No 113 - WW 224 - B.Tech. AG - 22AG008
		{HallNo: "WW 224", CourseCode: "22AG008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG106", "7376232AG109")...)
			r = append(r, expandRange("7376232AG111", "7376232AG129")...)
			r = append(r, "7376232AG131", "7376232AG132")
			return r
		}()},

		// S.No 114 - WW 225 - 22AG008
		{HallNo: "WW 225", CourseCode: "22AG008", RegisterNos: []string{"7376232AG502"}},

		// S.No 115 - WW 225 - B.E. CE - 22CE016
		{HallNo: "WW 225", CourseCode: "22CE016", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CE101")
			r = append(r, expandRange("7376231CE103", "7376231CE120")...)
			return r
		}()},

		// S.No 116 - WW 225 - B.E. BM - 22BM005
		{HallNo: "WW 225", CourseCode: "22BM005", RegisterNos: expandRange("7376231BM146", "7376231BM151")},

		// S.No 117 - WW 225 - B.Tech. AG - 22AG008
		{HallNo: "WW 225", CourseCode: "22AG008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG133", "7376232AG154")...)
			r = append(r, "7376242AG501", "7376242AG502")
			return r
		}()},

		// S.No 118 - WW 226 - B.E. MC - 22MC007
		{HallNo: "WW 226", CourseCode: "22MC007", RegisterNos: []string{"7376231MC506", "7376231MC507"}},

		// S.No 119 - WW 226 - B.Tech. FD - 22FD040
		{HallNo: "WW 226", CourseCode: "22FD040", RegisterNos: []string{
			"7376222FD107", "7376222FD116", "7376222FD125",
		}},

		// S.No 120 - WW 226 - B.E. CE - 22CE016
		{HallNo: "WW 226", CourseCode: "22CE016", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CE121", "7376231CE129")...)
			r = append(r, expandRange("7376241CE501", "7376241CE504")...)
			return r
		}()},

		// S.No 121 - WW 226 - B.Tech. FD - 22FD040
		{HallNo: "WW 226", CourseCode: "22FD040", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FD101", "7376232FD103")...)
			r = append(r, expandRange("7376232FD105", "7376232FD120")...)
			r = append(r, expandRange("7376232FD122", "7376232FD132")...)
			return r
		}()},

		// S.No 122 - WW 226 - B.Tech. AG - 22AG008
		{HallNo: "WW 226", CourseCode: "22AG008", RegisterNos: []string{"7376242AG503", "7376242AG504"}},

		// S.No 123 - WW 227 - B.Tech. BT - 22BT036
		{HallNo: "WW 227", CourseCode: "22BT036", RegisterNos: []string{
			"7376232BT101", "7376232BT107", "7376232BT110", "7376232BT112", "7376232BT121",
			"7376232BT123", "7376232BT124", "7376232BT131", "7376232BT133", "7376232BT134",
			"7376232BT138", "7376232BT147", "7376232BT152", "7376232BT153", "7376232BT158",
			"7376232BT162", "7376232BT163", "7376232BT165", "7376232BT166", "7376232BT172",
			"7376232BT173", "7376232BT176", "7376232BT178", "7376232BT180", "7376232BT184",
			"7376232BT188", "7376232BT192", "7376232BT197", "7376232BT199", "7376232BT201",
		}},

		// S.No 124 - WW 227 - B.Tech. FD - 22FD040
		{HallNo: "WW 227", CourseCode: "22FD040", RegisterNos: expandRange("7376232FD133", "7376232FD152")},
	}
}

func buildSeatingData18AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. CE - 22CE007
		{HallNo: "EW 101", CourseCode: "22CE007", RegisterNos: []string{"7376221CE124", "7376231CE503"}},

		// S.No 2 - EW 101 - B.E. EC - 22EC013
		{HallNo: "EW 101", CourseCode: "22EC013", RegisterNos: []string{"7376221EC107", "7376221EC214"}},

		// S.No 3 - EW 101 - B.E. MC - 22MC025
		{HallNo: "EW 101", CourseCode: "22MC025", RegisterNos: []string{"7376231MC507"}},

		// S.No 4 - EW 101 - B.E. BM - 22BM028
		{HallNo: "EW 101", CourseCode: "22BM028", RegisterNos: []string{"7376231BM501", "7376231BM502"}},

		// S.No 5 - EW 101 - B.E. SE - 22IS015
		{HallNo: "EW 101", CourseCode: "22IS015", RegisterNos: []string{
			"7376221SE123", "7376221SE134", "7376221SE140",
		}},

		// S.No 6 - EW 101 - B.Tech. FD - 22FD025
		{HallNo: "EW 101", CourseCode: "22FD025", RegisterNos: []string{
			"7376222FD107", "7376222FD116", "7376222FD125",
		}},

		// S.No 7 - EW 101 - B.Tech. IT - 22IT021
		{HallNo: "EW 101", CourseCode: "22IT021", RegisterNos: []string{"7376222IT110"}},

		// S.No 8 - EW 101 - B.Tech. AD - 22AI027
		{HallNo: "EW 101", CourseCode: "22AI027", RegisterNos: []string{"7376222AD174", "7376232AD502"}},

		// S.No 9 - EW 101 - B.Tech. AG - 22AG026
		{HallNo: "EW 101", CourseCode: "22AG026", RegisterNos: []string{"7376222AG120"}},

		// S.No 10 - EW 101 - B.E. ME - 22ME012
		{HallNo: "EW 101", CourseCode: "22ME012", RegisterNos: []string{"7376231ME130"}},

		// S.No 11 - EW 101 - B.Tech. FD - 22FD025
		{HallNo: "EW 101", CourseCode: "22FD025", RegisterNos: []string{"7376232FD118", "7376232FD137"}},

		// S.No 12 - EW 101 - B.Tech. AL - 22AM026
		{HallNo: "EW 101", CourseCode: "22AM026", RegisterNos: []string{"7376242AL501"}},

		// S.No 13 - EW 101 - B.Tech. AG - 22AG026
		{HallNo: "EW 101", CourseCode: "22AG026", RegisterNos: []string{"7376232AG129", "7376232AG151"}},
	}
}

func buildSeatingData19FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 302 - B.E. CS - 22CS405
		{HallNo: "AE 302", CourseCode: "22CS405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS154", "7376241CS157")...)
			r = append(r, expandRange("7376241CS159", "7376241CS169")...)
			return r
		}()},

		// S.No 2 - AE 302 - B.E. EC - 22EC405
		{HallNo: "AE 302", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC129", "7376241EC138")},

		// S.No 3 - EW 101 - B.E. CS - 22CS405
		{HallNo: "EW 101", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS170", "7376241CS184")},

		// S.No 4 - EW 101 - B.E. EC - 22EC405
		{HallNo: "EW 101", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC139", "7376241EC148")},

		// S.No 5 - EW 102 - B.E. CS - 22CS405
		{HallNo: "EW 102", CourseCode: "22CS405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS185", "7376241CS188")...)
			r = append(r, expandRange("7376241CS190", "7376241CS200")...)
			return r
		}()},

		// S.No 6 - EW 102 - B.E. EC - 22EC405
		{HallNo: "EW 102", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC149", "7376241EC158")},

		// S.No 7 - EW 103 - B.E. CS - 22CS405
		{HallNo: "EW 103", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS247", "7376241CS261")},

		// S.No 8 - EW 103 - B.E. EC - 22EC405
		{HallNo: "EW 103", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC190", "7376241EC199")},

		// S.No 9 - EW 104 - B.E. CS - 22CS405
		{HallNo: "EW 104", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS337", "7376241CS351")},

		// S.No 10 - EW 104 - B.E. EC - 22EC405
		{HallNo: "EW 104", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC252", "7376241EC261")},

		// S.No 11 - EW 105 - B.E. CS - 22CS405
		{HallNo: "EW 105", CourseCode: "22CS405", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241CS352", "7376241CS353")
			r = append(r, expandRange("7376241CS355", "7376241CS367")...)
			return r
		}()},

		// S.No 12 - EW 105 - B.E. EC - 22EC405
		{HallNo: "EW 105", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC262", "7376241EC271")},

		// S.No 13 - EW 106 - 22EC405
		{HallNo: "EW 106", CourseCode: "22EC405", RegisterNos: []string{"7376241EC516", "7376241EC521"}},

		// S.No 14 - EW 106 - B.E. CS - 22CS405
		{HallNo: "EW 106", CourseCode: "22CS405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS469", "7376241CS476")...)
			r = append(r, expandRange("7376251CS501", "7376251CS507")...)
			return r
		}()},

		// S.No 15 - EW 106 - B.E. EC - 22EC405
		{HallNo: "EW 106", CourseCode: "22EC405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC347", "7376241EC352")...)
			r = append(r, "7376251EC501", "7376251EC502")
			return r
		}()},

		// S.No 16 - EW 107 - B.E. CS - 22CS405
		{HallNo: "EW 107", CourseCode: "22CS405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS216", "7376241CS228")...)
			r = append(r, "7376241CS230", "7376241CS231")
			return r
		}()},

		// S.No 17 - EW 107 - B.E. EC - 22EC405
		{HallNo: "EW 107", CourseCode: "22EC405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC169", "7376241EC174")...)
			r = append(r, expandRange("7376241EC176", "7376241EC179")...)
			return r
		}()},

		// S.No 18 - EW 108 - B.E. CS - 22CS405
		{HallNo: "EW 108", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS262", "7376241CS276")},

		// S.No 19 - EW 108 - B.E. EC - 22EC405
		{HallNo: "EW 108", CourseCode: "22EC405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC200", "7376241EC207")...)
			r = append(r, "7376241EC209", "7376241EC210")
			return r
		}()},

		// S.No 20 - EW 109 - B.E. CS - 22CS405
		{HallNo: "EW 109", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS292", "7376241CS306")},

		// S.No 21 - EW 109 - B.E. EC - 22EC405
		{HallNo: "EW 109", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC221", "7376241EC230")},

		// S.No 22 - EW 111 - B.E. CS - 22CS405
		{HallNo: "EW 111", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS322", "7376241CS336")},

		// S.No 23 - EW 111 - B.E. EC - 22EC405
		{HallNo: "EW 111", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC242", "7376241EC251")},

		// S.No 24 - EW 112 - B.E. CS - 22CS405
		{HallNo: "EW 112", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS368", "7376241CS382")},

		// S.No 25 - EW 112 - B.E. EC - 22EC405
		{HallNo: "EW 112", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC272", "7376241EC281")},

		// S.No 26 - EW 113 - B.Tech. IT - 22IT405
		{HallNo: "EW 113", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT269", "7376242IT283")},

		// S.No 27 - EW 113 - B.Tech. AD - 22AI405
		{HallNo: "EW 113", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD224", "7376242AD233")},

		// S.No 28 - EW 114 - B.Tech. IT - 22IT405
		{HallNo: "EW 114", CourseCode: "22IT405", RegisterNos: expandRange("7376252IT501", "7376252IT515")},

		// S.No 29 - EW 114 - B.Tech. AD - 22AI405
		{HallNo: "EW 114", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD284", "7376242AD293")},

		// S.No 30 - EW 115 - B.E. EE - 22EE405
		{HallNo: "EW 115", CourseCode: "22EE405", RegisterNos: expandRange("7376241EE134", "7376241EE148")},

		// S.No 31 - EW 115 - B.Tech. AD - 22AI405
		{HallNo: "EW 115", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD329", "7376242AD338")},

		// S.No 32 - EW 116 - B.E. EE - 22EE405
		{HallNo: "EW 116", CourseCode: "22EE405", RegisterNos: expandRange("7376241EE149", "7376241EE163")},

		// S.No 33 - EW 116 - B.Tech. AD - 22AI405
		{HallNo: "EW 116", CourseCode: "22AI405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD339", "7376242AD346")...)
			r = append(r, "7376252AD501", "7376252AD502")
			return r
		}()},

		// S.No 34 - EW 117 - B.E. EE - 22EE405
		{HallNo: "EW 117", CourseCode: "22EE405", RegisterNos: expandRange("7376241EE180", "7376241EE194")},

		// S.No 35 - EW 117 - B.Tech. AD - 22AI405
		{HallNo: "EW 117", CourseCode: "22AI405", RegisterNos: expandRange("7376252AD513", "7376252AD516")},

		// S.No 36 - EW 117 - B.Tech. AL - 22AM405
		{HallNo: "EW 117", CourseCode: "22AM405", RegisterNos: expandRange("7376242AL101", "7376242AL106")},

		// S.No 37 - EW 118 - B.E. EE - 22EE405
		{HallNo: "EW 118", CourseCode: "22EE405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE210", "7376241EE217")...)
			r = append(r, expandRange("7376251EE501", "7376251EE507")...)
			return r
		}()},

		// S.No 38 - EW 118 - B.Tech. AL - 22AM405
		{HallNo: "EW 118", CourseCode: "22AM405", RegisterNos: expandRange("7376242AL117", "7376242AL126")},

		// S.No 39 - EW 201 - B.Tech. AD - 22AI405
		{HallNo: "EW 201", CourseCode: "22AI405", RegisterNos: []string{"7376232AD502"}},

		// S.No 40 - EW 201 - 22AI405
		{HallNo: "EW 201", CourseCode: "22AI405", RegisterNos: []string{
			"7376232AD174", "7376232AD250", "7376232AD282",
		}},

		// S.No 41 - EW 201 - B.Tech. IT - 22IT405
		{HallNo: "EW 201", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT103", "7376242IT117")},

		// S.No 42 - EW 201 - B.Tech. AD - 22AI405
		{HallNo: "EW 201", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD102", "7376242AD107")},

		// S.No 43 - EW 202 - B.Tech. IT - 22IT405
		{HallNo: "EW 202", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT133", "7376242IT147")},

		// S.No 44 - EW 202 - B.Tech. AD - 22AI405
		{HallNo: "EW 202", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD118", "7376242AD127")},

		// S.No 45 - EW 203 - B.Tech. IT - 22IT405
		{HallNo: "EW 203", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT284", "7376242IT298")},

		// S.No 46 - EW 203 - B.Tech. AD - 22AI405
		{HallNo: "EW 203", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD234", "7376242AD243")},

		// S.No 47 - EW 204 - B.Tech. IT - 22IT405
		{HallNo: "EW 204", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT330", "7376242IT339")},

		// S.No 48 - EW 204 - B.Tech. AD - 22AI405
		{HallNo: "EW 204", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD264", "7376242AD273")},

		// S.No 49 - EW 205 - B.E. EE - 22EE405
		{HallNo: "EW 205", CourseCode: "22EE405", RegisterNos: []string{"7376231EE111", "7376231EE115"}},

		// S.No 50 - EW 205 - 22EE405
		{HallNo: "EW 205", CourseCode: "22EE405", RegisterNos: expandRange("7376241EE101", "7376241EE107")},

		// S.No 51 - EW 205 - B.Tech. IT - 22IT405
		{HallNo: "EW 205", CourseCode: "22IT405", RegisterNos: []string{"7376252IT516"}},

		// S.No 52 - EW 205 - B.Tech. AD - 22AI405
		{HallNo: "EW 205", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD294", "7376242AD303")},

		// S.No 53 - EW 206 - B.E. EE - 22EE405
		{HallNo: "EW 206", CourseCode: "22EE405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE108", "7376241EE111")...)
			r = append(r, expandRange("7376241EE113", "7376241EE133")...)
			return r
		}()},

		// S.No 54 - EW 206 - B.Tech. AD - 22AI405
		{HallNo: "EW 206", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD304", "7376242AD328")},

		// S.No 55 - EW 207 - B.E. CS - 22CS405
		{HallNo: "EW 207", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS454", "7376241CS468")},

		// S.No 56 - EW 207 - B.E. EC - 22EC405
		{HallNo: "EW 207", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC337", "7376241EC346")},

		// S.No 57 - EW 208 - B.E. CS - 22CS405
		{HallNo: "EW 208", CourseCode: "22CS405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS508", "7376251CS513")...)
			r = append(r, expandRange("7376251CS515", "7376251CS523")...)
			return r
		}()},

		// S.No 58 - EW 208 - B.E. EC - 22EC405
		{HallNo: "EW 208", CourseCode: "22EC405", RegisterNos: expandRange("7376251EC503", "7376251EC512")},

		// S.No 59 - EW 209 - B.Tech. IT - 22IT405
		{HallNo: "EW 209", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT118", "7376242IT132")},

		// S.No 60 - EW 209 - B.Tech. AD - 22AI405
		{HallNo: "EW 209", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD108", "7376242AD117")},

		// S.No 61 - EW 210 - B.Tech. IT - 22IT405
		{HallNo: "EW 210", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT164", "7376242IT173")},

		// S.No 62 - EW 210 - B.Tech. AD - 22AI405
		{HallNo: "EW 210", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD139", "7376242AD148")},

		// S.No 63 - EW 211 - B.Tech. IT - 22IT405
		{HallNo: "EW 211", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT219", "7376242IT228")},

		// S.No 64 - EW 211 - B.Tech. AD - 22AI405
		{HallNo: "EW 211", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD179", "7376242AD188")},

		// S.No 65 - EW 212 - B.Tech. IT - 22IT405
		{HallNo: "EW 212", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT229", "7376242IT253")},

		// S.No 66 - EW 212 - B.Tech. AD - 22AI405
		{HallNo: "EW 212", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD189", "7376242AD213")},

		// S.No 67 - EW 213 - B.Tech. BT - 22BT405
		{HallNo: "EW 213", CourseCode: "22BT405", RegisterNos: []string{"7376222BT110"}},

		// S.No 68 - EW 213 - 22BT405
		{HallNo: "EW 213", CourseCode: "22BT405", RegisterNos: []string{
			"7376232BT142", "7376232BT152", "7376232BT163", "7376232BT176",
		}},

		// S.No 69 - EW 213 - B.E. EE - 22EE405
		{HallNo: "EW 213", CourseCode: "22EE405", RegisterNos: expandRange("7376251EE508", "7376251EE517")},

		// S.No 70 - EW 213 - B.Tech. AL - 22AM405
		{HallNo: "EW 213", CourseCode: "22AM405", RegisterNos: expandRange("7376242AL127", "7376242AL136")},

		// S.No 71 - EW 214 - B.Tech. BT - 22BT405
		{HallNo: "EW 214", CourseCode: "22BT405", RegisterNos: expandRange("7376242BT102", "7376242BT116")},

		// S.No 72 - EW 214 - B.Tech. AL - 22AM405
		{HallNo: "EW 214", CourseCode: "22AM405", RegisterNos: expandRange("7376242AL137", "7376242AL146")},

		// S.No 73 - EW 215 - B.Tech. BT - 22BT405
		{HallNo: "EW 215", CourseCode: "22BT405", RegisterNos: expandRange("7376242BT117", "7376242BT131")},

		// S.No 74 - EW 215 - B.Tech. AL - 22AM405
		{HallNo: "EW 215", CourseCode: "22AM405", RegisterNos: expandRange("7376242AL147", "7376242AL156")},

		// S.No 75 - EW 216 - B.Tech. BT - 22BT405
		{HallNo: "EW 216", CourseCode: "22BT405", RegisterNos: expandRange("7376242BT132", "7376242BT141")},

		// S.No 76 - EW 216 - B.Tech. AL - 22AM405
		{HallNo: "EW 216", CourseCode: "22AM405", RegisterNos: expandRange("7376242AL157", "7376242AL166")},

		// S.No 77 - EW 217 - B.Tech. BT - 22BT405
		{HallNo: "EW 217", CourseCode: "22BT405", RegisterNos: expandRange("7376242BT142", "7376242BT151")},

		// S.No 78 - EW 217 - B.Tech. AL - 22AM405
		{HallNo: "EW 217", CourseCode: "22AM405", RegisterNos: expandRange("7376242AL167", "7376242AL176")},

		// S.No 79 - EW 218 - B.Tech. BT - 22BT405
		{HallNo: "EW 218", CourseCode: "22BT405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT152", "7376242BT160")...)
			r = append(r, expandRange("7376242BT162", "7376242BT177")...)
			return r
		}()},

		// S.No 80 - EW 218 - B.Tech. AL - 22AM405
		{HallNo: "EW 218", CourseCode: "22AM405", RegisterNos: expandRange("7376242AL177", "7376242AL201")},

		// S.No 81 - MH 301 - B.E. CS - 22CS405
		{HallNo: "MH 301", CourseCode: "22CS405", RegisterNos: []string{"7376221CS111"}},

		// S.No 82 - MH 301 - B.E. EC - 22EC405
		{HallNo: "MH 301", CourseCode: "22EC405", RegisterNos: []string{
			"7376221EC102", "7376221EC107", "7376221EC116", "7376221EC151",
			"7376221EC192", "7376221EC226", "7376221EC337",
		}},

		// S.No 83 - MH 301 - B.E. CS - 22CS405
		{HallNo: "MH 301", CourseCode: "22CS405", RegisterNos: []string{
			"7376231CS102", "7376231CS103", "7376231CS190", "7376231CS235",
			"7376231CS244", "7376231CS259", "7376231CS292",
		}},

		// S.No 84 - MH 301 - B.E. EC - 22EC405
		{HallNo: "MH 301", CourseCode: "22EC405", RegisterNos: []string{
			"7376231EC101", "7376231EC112", "7376231EC196",
		}},

		// S.No 85 - MH 301 - B.E. CS - 22CS405
		{HallNo: "MH 301", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS102", "7376241CS108")},

		// S.No 86 - MH 302 - B.E. EC - 22EC405
		{HallNo: "MH 302", CourseCode: "22EC405", RegisterNos: []string{"7376231EC514"}},

		// S.No 87 - MH 302 - 22EC405
		{HallNo: "MH 302", CourseCode: "22EC405", RegisterNos: []string{
			"7376231EC283", "7376231EC297", "7376231EC305", "7376231EC331", "7376231EC334",
		}},

		// S.No 88 - MH 302 - B.E. CS - 22CS405
		{HallNo: "MH 302", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS109", "7376241CS123")},

		// S.No 89 - MH 302 - B.E. EC - 22EC405
		{HallNo: "MH 302", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC103", "7376241EC106")},

		// S.No 90 - MH 303 - B.E. CS - 22CS405
		{HallNo: "MH 303", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS124", "7376241CS138")},

		// S.No 91 - MH 303 - B.E. EC - 22EC405
		{HallNo: "MH 303", CourseCode: "22EC405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC107", "7376241EC110")...)
			r = append(r, "7376241EC112", "7376241EC113")
			r = append(r, expandRange("7376241EC115", "7376241EC118")...)
			return r
		}()},

		// S.No 92 - MH 305 - B.E. CS - 22CS405
		{HallNo: "MH 305", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS139", "7376241CS153")},

		// S.No 93 - MH 305 - B.E. EC - 22EC405
		{HallNo: "MH 305", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC119", "7376241EC128")},

		// S.No 94 - WW 005 - B.Tech. IT - 22IT405
		{HallNo: "WW 005", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT254", "7376242IT268")},

		// S.No 95 - WW 005 - B.Tech. AD - 22AI405
		{HallNo: "WW 005", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD214", "7376242AD223")},

		// S.No 96 - WW 006 - B.Tech. IT - 22IT405
		{HallNo: "WW 006", CourseCode: "22IT405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT299", "7376242IT303")...)
			r = append(r, expandRange("7376242IT305", "7376242IT314")...)
			return r
		}()},

		// S.No 97 - WW 006 - B.Tech. AD - 22AI405
		{HallNo: "WW 006", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD244", "7376242AD253")},

		// S.No 98 - WW 007 - B.Tech. IT - 22IT405
		{HallNo: "WW 007", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT315", "7376242IT329")},

		// S.No 99 - WW 007 - B.Tech. AD - 22AI405
		{HallNo: "WW 007", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD254", "7376242AD263")},

		// S.No 100 - WW 008 - B.Tech. IT - 22IT405
		{HallNo: "WW 008", CourseCode: "22IT405", RegisterNos: []string{
			"7376242IT502", "7376242IT506", "7376242IT509",
		}},

		// S.No 101 - WW 008 - 22IT405
		{HallNo: "WW 008", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT340", "7376242IT351")},

		// S.No 102 - WW 008 - B.Tech. AD - 22AI405
		{HallNo: "WW 008", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD274", "7376242AD283")},

		// S.No 103 - WW 011 - B.E. EE - 22EE405
		{HallNo: "WW 011", CourseCode: "22EE405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE164", "7376241EE171")...)
			r = append(r, expandRange("7376241EE173", "7376241EE179")...)
			return r
		}()},

		// S.No 104 - WW 011 - B.Tech. AD - 22AI405
		{HallNo: "WW 011", CourseCode: "22AI405", RegisterNos: expandRange("7376252AD503", "7376252AD512")},

		// S.No 105 - WW 012 - B.E. EE - 22EE405
		{HallNo: "WW 012", CourseCode: "22EE405", RegisterNos: expandRange("7376241EE195", "7376241EE209")},

		// S.No 106 - WW 012 - B.Tech. AL - 22AM405
		{HallNo: "WW 012", CourseCode: "22AM405", RegisterNos: expandRange("7376242AL107", "7376242AL116")},

		// S.No 107 - WW 113 - B.E. CS - 22CS405
		{HallNo: "WW 113", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS201", "7376241CS215")},

		// S.No 108 - WW 113 - B.E. EC - 22EC405
		{HallNo: "WW 113", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC159", "7376241EC168")},

		// S.No 109 - WW 114 - B.E. CS - 22CS405
		{HallNo: "WW 114", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS232", "7376241CS246")},

		// S.No 110 - WW 114 - B.E. EC - 22EC405
		{HallNo: "WW 114", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC180", "7376241EC189")},

		// S.No 111 - WW 115 - B.E. CS - 22CS405
		{HallNo: "WW 115", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS277", "7376241CS291")},

		// S.No 112 - WW 115 - B.E. EC - 22EC405
		{HallNo: "WW 115", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC211", "7376241EC220")},

		// S.No 113 - WW 117 - B.E. CS - 22CS405
		{HallNo: "WW 117", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS307", "7376241CS321")},

		// S.No 114 - WW 117 - B.E. EC - 22EC405
		{HallNo: "WW 117", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC232", "7376241EC241")},

		// S.No 115 - WW 118 - B.E. CS - 22CS405
		{HallNo: "WW 118", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS383", "7376241CS397")},

		// S.No 116 - WW 118 - B.E. EC - 22EC405
		{HallNo: "WW 118", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC282", "7376241EC291")},

		// S.No 117 - WW 202 - B.E. CS - 22CS405
		{HallNo: "WW 202", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS398", "7376241CS422")},

		// S.No 118 - WW 202 - B.E. EC - 22EC405
		{HallNo: "WW 202", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC292", "7376241EC316")},

		// S.No 119 - WW 203 - B.E. CS - 22CS405
		{HallNo: "WW 203", CourseCode: "22CS405", RegisterNos: expandRange("7376241CS423", "7376241CS437")},

		// S.No 120 - WW 203 - B.E. EC - 22EC405
		{HallNo: "WW 203", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC317", "7376241EC326")},

		// S.No 121 - WW 204 - B.Tech. IT - 22IT405
		{HallNo: "WW 204", CourseCode: "22IT405", RegisterNos: []string{
			"7376222IT110", "7376222IT245", "7376222IT281",
		}},

		// S.No 122 - WW 204 - 22IT405
		{HallNo: "WW 204", CourseCode: "22IT405", RegisterNos: []string{
			"7376232IT118", "7376232IT152", "7376232IT211", "7376232IT224",
			"7376232IT228", "7376232IT250", "7376232IT268", "7376232IT274", "7376232IT282",
		}},

		// S.No 123 - WW 204 - B.Tech. AD - 22AI405
		{HallNo: "WW 204", CourseCode: "22AI405", RegisterNos: []string{"7376232AD136"}},

		// S.No 124 - WW 204 - B.E. CS - 22CS405
		{HallNo: "WW 204", CourseCode: "22CS405", RegisterNos: []string{"7376251CS524"}},

		// S.No 125 - WW 204 - B.E. EC - 22EC405
		{HallNo: "WW 204", CourseCode: "22EC405", RegisterNos: expandRange("7376251EC513", "7376251EC521")},

		// S.No 126 - WW 204 - B.Tech. IT - 22IT405
		{HallNo: "WW 204", CourseCode: "22IT405", RegisterNos: []string{"7376242IT101", "7376242IT102"}},

		// S.No 127 - WW 205 - 22IT405
		{HallNo: "WW 205", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT174", "7376242IT188")},

		// S.No 128 - WW 205 - B.Tech. AD - 22AI405
		{HallNo: "WW 205", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD149", "7376242AD158")},

		// S.No 129 - WW 211 - B.E. CS - 22CS405
		{HallNo: "WW 211", CourseCode: "22CS405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS438", "7376241CS442")...)
			r = append(r, expandRange("7376241CS444", "7376241CS453")...)
			return r
		}()},

		// S.No 130 - WW 211 - B.E. EC - 22EC405
		{HallNo: "WW 211", CourseCode: "22EC405", RegisterNos: expandRange("7376241EC327", "7376241EC336")},

		// S.No 131 - WW 212 - B.E. CE - 22CE405
		{HallNo: "WW 212", CourseCode: "22CE405", RegisterNos: []string{"7376221CE123", "7376221CE124"}},

		// S.No 132 - WW 212 - B.E. MC - 22MC405
		{HallNo: "WW 212", CourseCode: "22MC405", RegisterNos: []string{"7376221MC125"}},

		// S.No 133 - WW 212 - B.E. SE - 22IS405
		{HallNo: "WW 212", CourseCode: "22IS405", RegisterNos: []string{
			"7376221SE134", "7376221SE140", "7376231SE504",
		}},

		// S.No 134 - WW 212 - B.E. CD - 22CD405
		{HallNo: "WW 212", CourseCode: "22CD405", RegisterNos: []string{"7376231CD503"}},

		// S.No 135 - WW 212 - B.Tech. FD - 22FD405
		{HallNo: "WW 212", CourseCode: "22FD405", RegisterNos: []string{"7376222FD107", "7376222FD125"}},

		// S.No 136 - WW 212 - B.Tech. TT - 22TT405
		{HallNo: "WW 212", CourseCode: "22TT405", RegisterNos: []string{"7376232TX515"}},

		// S.No 137 - WW 212 - B.E. CE - 22CE405
		{HallNo: "WW 212", CourseCode: "22CE405", RegisterNos: []string{
			"7376231CE117", "7376231CE120", "7376241CE501",
		}},

		// S.No 138 - WW 212 - B.E. BM - 22BM405
		{HallNo: "WW 212", CourseCode: "22BM405", RegisterNos: []string{
			"7376231BM107", "7376231BM148", "7376241BM501",
		}},

		// S.No 139 - WW 212 - B.E. SE - 22IS405
		{HallNo: "WW 212", CourseCode: "22IS405", RegisterNos: []string{"7376231SE137"}},

		// S.No 140 - WW 212 - B.E. CD - 22CD405
		{HallNo: "WW 212", CourseCode: "22CD405", RegisterNos: []string{"7376241CD501", "7376241CD502"}},

		// S.No 141 - WW 212 - B.Tech. CT - 22CT405
		{HallNo: "WW 212", CourseCode: "22CT405", RegisterNos: []string{"7376232CT122", "7376242CT503"}},

		// S.No 142 - WW 212 - B.Tech. AG - 22AG405
		{HallNo: "WW 212", CourseCode: "22AG405", RegisterNos: []string{"7376242AG502"}},

		// S.No 143 - WW 212 - 22AG405
		{HallNo: "WW 212", CourseCode: "22AG405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AG111", "7376242AG124")...)
			r = append(r, "7376252AG501", "7376252AG502")
			return r
		}()},

		// S.No 144 - WW 213 - B.Tech. IT - 22IT405
		{HallNo: "WW 213", CourseCode: "22IT405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT148", "7376242IT153")...)
			r = append(r, expandRange("7376242IT155", "7376242IT163")...)
			return r
		}()},

		// S.No 145 - WW 213 - B.Tech. AD - 22AI405
		{HallNo: "WW 213", CourseCode: "22AI405", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD128", "7376242AD129")
			r = append(r, expandRange("7376242AD131", "7376242AD138")...)
			return r
		}()},

		// S.No 146 - WW 214 - B.Tech. IT - 22IT405
		{HallNo: "WW 214", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT189", "7376242IT203")},

		// S.No 147 - WW 214 - B.Tech. AD - 22AI405
		{HallNo: "WW 214", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD159", "7376242AD168")},

		// S.No 148 - WW 215 - B.Tech. IT - 22IT405
		{HallNo: "WW 215", CourseCode: "22IT405", RegisterNos: expandRange("7376242IT204", "7376242IT218")},

		// S.No 149 - WW 215 - B.Tech. AD - 22AI405
		{HallNo: "WW 215", CourseCode: "22AI405", RegisterNos: expandRange("7376242AD169", "7376242AD178")},

		// S.No 150 - WW 218 - B.Tech. BT - 22BT405
		{HallNo: "WW 218", CourseCode: "22BT405", RegisterNos: expandRange("7376242BT178", "7376242BT192")},

		// S.No 151 - WW 218 - B.Tech. AL - 22AM405
		{HallNo: "WW 218", CourseCode: "22AM405", RegisterNos: expandRange("7376242AL202", "7376242AL211")},

		// S.No 152 - WW 219 - B.Tech. BT - 22BT405
		{HallNo: "WW 219", CourseCode: "22BT405", RegisterNos: expandRange("7376242BT193", "7376242BT207")},

		// S.No 153 - WW 219 - B.Tech. AL - 22AM405
		{HallNo: "WW 219", CourseCode: "22AM405", RegisterNos: expandRange("7376242AL212", "7376242AL221")},

		// S.No 154 - WW 222 - B.E. ME - 22ME405
		{HallNo: "WW 222", CourseCode: "22ME405", RegisterNos: []string{"7376221ME154"}},

		// S.No 155 - WW 222 - 22ME405
		{HallNo: "WW 222", CourseCode: "22ME405", RegisterNos: []string{"7376231ME130"}},

		// S.No 156 - WW 222 - B.E. MZ - 22MC405
		{HallNo: "WW 222", CourseCode: "22MC405", RegisterNos: []string{
			"7376231MZ106", "7376231MZ111", "7376231MZ148",
		}},

		// S.No 157 - WW 222 - B.E. ME - 22ME405
		{HallNo: "WW 222", CourseCode: "22ME405", RegisterNos: expandRange("7376241ME102", "7376241ME109")},

		// S.No 158 - WW 222 - B.E. MZ - 22MC405
		{HallNo: "WW 222", CourseCode: "22MC405", RegisterNos: expandRange("7376241MZ101", "7376241MZ117")},

		// S.No 159 - WW 222 - B.Tech. BT - 22BT405
		{HallNo: "WW 222", CourseCode: "22BT405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT208", "7376242BT218")...)
			r = append(r, expandRange("7376242BT220", "7376242BT222")...)
			r = append(r, "7376252BT501")
			return r
		}()},

		// S.No 160 - WW 222 - B.Tech. AL - 22AM405
		{HallNo: "WW 222", CourseCode: "22AM405", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AL222", "7376242AL223")
			r = append(r, expandRange("7376252AL501", "7376252AL503")...)
			return r
		}()},

		// S.No 161 - WW 223 - B.E. ME - 22ME405
		{HallNo: "WW 223", CourseCode: "22ME405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241ME110", "7376241ME132")...)
			r = append(r, "7376241ME134", "7376241ME135")
			return r
		}()},

		// S.No 162 - WW 223 - B.E. MZ - 22MC405
		{HallNo: "WW 223", CourseCode: "22MC405", RegisterNos: expandRange("7376241MZ118", "7376241MZ142")},

		// S.No 163 - WW 224 - B.Tech. CB - 22CB405
		{HallNo: "WW 224", CourseCode: "22CB405", RegisterNos: []string{"7376232CB111"}},

		// S.No 164 - WW 224 - B.E. ME - 22ME405
		{HallNo: "WW 224", CourseCode: "22ME405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241ME136", "7376241ME159")...)
			r = append(r, "7376251ME501")
			return r
		}()},

		// S.No 165 - WW 224 - B.E. MZ - 22MC405
		{HallNo: "WW 224", CourseCode: "22MC405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241MZ143", "7376241MZ160")...)
			r = append(r, expandRange("7376251MZ501", "7376251MZ506")...)
			return r
		}()},

		// S.No 166 - WW 225 - B.E. EI - 22EI405
		{HallNo: "WW 225", CourseCode: "22EI405", RegisterNos: []string{"7376231EI503"}},

		// S.No 167 - WW 225 - 22EI405
		{HallNo: "WW 225", CourseCode: "22EI405", RegisterNos: []string{"7376231EI128"}},

		// S.No 168 - WW 225 - B.Tech. CB - 22CB405
		{HallNo: "WW 225", CourseCode: "22CB405", RegisterNos: []string{"7376232CB123", "7376232CB133"}},

		// S.No 169 - WW 225 - B.E. EI - 22EI405
		{HallNo: "WW 225", CourseCode: "22EI405", RegisterNos: expandRange("7376241EI101", "7376241EI116")},

		// S.No 170 - WW 225 - B.E. ME - 22ME405
		{HallNo: "WW 225", CourseCode: "22ME405", RegisterNos: expandRange("7376251ME502", "7376251ME508")},

		// S.No 171 - WW 225 - B.Tech. CB - 22CB405
		{HallNo: "WW 225", CourseCode: "22CB405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB102", "7376242CB105")...)
			r = append(r, expandRange("7376242CB107", "7376242CB125")...)
			return r
		}()},

		// S.No 172 - WW 226 - B.E. EI - 22EI405
		{HallNo: "WW 226", CourseCode: "22EI405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI117", "7376241EI125")...)
			r = append(r, expandRange("7376241EI127", "7376241EI142")...)
			return r
		}()},

		// S.No 173 - WW 226 - B.Tech. CB - 22CB405
		{HallNo: "WW 226", CourseCode: "22CB405", RegisterNos: expandRange("7376242CB126", "7376242CB150")},

		// S.No 174 - WW 227 - B.E. CD - 22CD405
		{HallNo: "WW 227", CourseCode: "22CD405", RegisterNos: []string{
			"7376221CD114", "7376221CD144", "7376221CD153",
		}},

		// S.No 175 - WW 227 - 22CD405
		{HallNo: "WW 227", CourseCode: "22CD405", RegisterNos: []string{"7376231CD110", "7376231CD143"}},

		// S.No 176 - WW 227 - B.Tech. CB - 22CB405
		{HallNo: "WW 227", CourseCode: "22CB405", RegisterNos: []string{"7376242CB502"}},

		// S.No 177 - WW 227 - B.Tech. AG - 22AG405
		{HallNo: "WW 227", CourseCode: "22AG405", RegisterNos: []string{"7376232AG129", "7376232AG151"}},

		// S.No 178 - WW 227 - B.E. EI - 22EI405
		{HallNo: "WW 227", CourseCode: "22EI405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI143", "7376241EI160")...)
			r = append(r, "7376251EI501", "7376251EI502")
			return r
		}()},

		// S.No 179 - WW 227 - B.Tech. CB - 22CB405
		{HallNo: "WW 227", CourseCode: "22CB405", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB151", "7376242CB159")...)
			r = append(r, expandRange("7376252CB501", "7376252CB503")...)
			return r
		}()},

		// S.No 180 - WW 227 - B.Tech. AG - 22AG405
		{HallNo: "WW 227", CourseCode: "22AG405", RegisterNos: expandRange("7376242AG101", "7376242AG110")},
	}
}

func buildSeatingData19AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.Tech. IT - 22HS004
		{HallNo: "EW 101", CourseCode: "22HS004", RegisterNos: []string{"7376212IT105"}},

		// S.No 2 - EW 101 - B.E. CS - 22HS004
		{HallNo: "EW 101", CourseCode: "22HS004", RegisterNos: []string{
			"7376231CS235", "7376231CS244", "7376231CS259",
		}},

		// S.No 3 - EW 101 - B.E. EC - 22HS004
		{HallNo: "EW 101", CourseCode: "22HS004", RegisterNos: []string{"7376231EC331", "7376231EC334"}},

		// S.No 4 - EW 101 - B.E. MZ - 22HS004
		{HallNo: "EW 101", CourseCode: "22HS004", RegisterNos: []string{"7376231MZ106", "7376231MZ111"}},

		// S.No 5 - EW 101 - B.Tech. IT - 22HS004
		{HallNo: "EW 101", CourseCode: "22HS004", RegisterNos: []string{
			"7376232IT118", "7376232IT152", "7376232IT282",
		}},

		// S.No 6 - EW 101 - B.E. EC - 22HS004
		{HallNo: "EW 101", CourseCode: "22HS004", RegisterNos: []string{
			"7376241EC151", "7376251EC507", "7376251EC508",
			"7376251EC511", "7376251EC517", "7376251EC521",
		}},

		// S.No 7 - EW 101 - B.Tech. IT - 22HS004
		{HallNo: "EW 101", CourseCode: "22HS004", RegisterNos: []string{
			"7376242IT184", "7376252IT502", "7376252IT503", "7376252IT504",
			"7376252IT507", "7376252IT511", "7376252IT513", "7376252IT515",
		}},

		// S.No 8 - EW 102 - B.E. CD - 22CD003
		{HallNo: "EW 102", CourseCode: "22CD003", RegisterNos: []string{
			"7376221CD114", "7376221CD126", "7376221CD144", "7376221CD153", "7376231CD503",
		}},

		// S.No 9 - EW 102 - B.Tech. AD - 22AI028
		{HallNo: "EW 102", CourseCode: "22AI028", RegisterNos: []string{"7376222AD123"}},

		// S.No 10 - EW 102 - B.E. MZ - 22HS004
		{HallNo: "EW 102", CourseCode: "22HS004", RegisterNos: []string{
			"7376231MZ113", "7376231MZ135", "7376241MZ501",
		}},

		// S.No 11 - EW 102 - B.Tech. AD - 22HS004
		{HallNo: "EW 102", CourseCode: "22HS004", RegisterNos: []string{"7376232AD250"}},

		// S.No 12 - EW 102 - B.E. CS - 22HS004
		{HallNo: "EW 102", CourseCode: "22HS004", RegisterNos: []string{
			"7376241CS143", "7376241CS295", "7376241CS318", "7376241CS395",
		}},

		// S.No 13 - EW 102 - B.E. EE - 22HS004
		{HallNo: "EW 102", CourseCode: "22HS004", RegisterNos: []string{
			"7376241EE130", "7376241EE146", "7376251EE502", "7376251EE504",
		}},

		// S.No 14 - EW 102 - B.E. MZ - 22HS004
		{HallNo: "EW 102", CourseCode: "22HS004", RegisterNos: []string{"7376251MZ504"}},

		// S.No 15 - EW 102 - B.Tech. AD - 22HS004
		{HallNo: "EW 102", CourseCode: "22HS004", RegisterNos: []string{
			"7376242AD189", "7376242AD218", "7376252AD502", "7376252AD509", "7376252AD512",
		}},

		// S.No 16 - EW 102 - B.Tech. AL - 22HS004
		{HallNo: "EW 102", CourseCode: "22HS004", RegisterNos: []string{"7376242AL169"}},

		// S.No 17 - EW 103 - B.E. CE - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{"7376221CE124"}},

		// S.No 18 - EW 103 - B.Tech. AD - 22AI028
		{HallNo: "EW 103", CourseCode: "22AI028", RegisterNos: []string{"7376232AD502"}},

		// S.No 19 - EW 103 - B.E. CE - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{"7376231CE120"}},

		// S.No 20 - EW 103 - B.E. EI - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{"7376231EI128"}},

		// S.No 21 - EW 103 - B.E. BM - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{"7376231BM107"}},

		// S.No 22 - EW 103 - B.E. SE - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{"7376231SE144"}},

		// S.No 23 - EW 103 - B.E. CD - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{"7376241CD501"}},

		// S.No 24 - EW 103 - B.Tech. BT - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{"7376232BT142"}},

		// S.No 25 - EW 103 - B.E. ME - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{"7376241ME146"}},

		// S.No 26 - EW 103 - B.Tech. BT - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{"7376252BT501"}},

		// S.No 27 - EW 103 - B.Tech. CB - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{"7376242CB116"}},

		// S.No 28 - EW 103 - B.Tech. AL - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{
			"7376242AL190", "7376242AL207", "7376242AL208",
		}},

		// S.No 29 - EW 103 - B.Tech. AG - 22HS004
		{HallNo: "EW 103", CourseCode: "22HS004", RegisterNos: []string{"7376252AG502"}},
	}
}

func buildSeatingData20FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 302 - B.E. CS - 22CS031
		{HallNo: "AE 302", CourseCode: "22CS031", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS181", "7376231CS184")...)
			r = append(r, "7376231CS186", "7376231CS188", "7376231CS190", "7376231CS192", "7376231CS194", "7376231CS196")
			return r
		}()},

		// S.No 2 - AE 302 - B.E. EC - 22EC004
		{HallNo: "AE 302", CourseCode: "22EC004", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC171", "7376231EC178")...)
			r = append(r, expandRange("7376231EC180", "7376231EC184")...)
			r = append(r, "7376231EC186", "7376231EC187")
			return r
		}()},

		// S.No 3 - EW 101 - B.E. CS - 22CS031
		{HallNo: "EW 101", CourseCode: "22CS031", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS199", "7376231CS202")...)
			r = append(r, "7376231CS204", "7376231CS206", "7376231CS207", "7376231CS210", "7376231CS212", "7376231CS216")
			return r
		}()},

		// S.No 4 - EW 101 - B.E. EC - 22EC004
		{HallNo: "EW 101", CourseCode: "22EC004", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC188", "7376231EC189")
			r = append(r, expandRange("7376231EC191", "7376231EC195")...)
			r = append(r, expandRange("7376231EC197", "7376231EC200")...)
			r = append(r, "7376231EC203", "7376231EC204", "7376231EC206", "7376231EC207")
			return r
		}()},

		// S.No 5 - EW 102 - B.E. CS - 22CS031
		{HallNo: "EW 102", CourseCode: "22CS031", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS221", "7376231CS223")...)
			r = append(r, expandRange("7376231CS226", "7376231CS228")...)
			r = append(r, "7376231CS232", "7376231CS233", "7376231CS235", "7376231CS236")
			return r
		}()},

		// S.No 6 - EW 102 - B.E. EC - 22EC004
		{HallNo: "EW 102", CourseCode: "22EC004", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC208")
			r = append(r, expandRange("7376231EC210", "7376231EC213")...)
			r = append(r, "7376231EC215", "7376231EC219", "7376231EC220")
			r = append(r, expandRange("7376231EC222", "7376231EC228")...)
			return r
		}()},

		// S.No 7 - EW 103 - B.E. CS - 22CS031
		{HallNo: "EW 103", CourseCode: "22CS031", RegisterNos: []string{
			"7376231CS283", "7376231CS286", "7376231CS289", "7376231CS292", "7376231CS294",
			"7376231CS295", "7376231CS298", "7376231CS299", "7376231CS302", "7376231CS304",
		}},

		// S.No 8 - EW 103 - B.E. EC - 22EC004
		{HallNo: "EW 103", CourseCode: "22EC004", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC281", "7376231EC284")...)
			r = append(r, expandRange("7376231EC286", "7376231EC296")...)
			return r
		}()},

		// S.No 9 - EW 104 - B.E. CS - 22CS002
		{HallNo: "EW 104", CourseCode: "22CS002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS137", "7376231CS138", "7376231CS141", "7376231CS142")
			r = append(r, expandRange("7376231CS146", "7376231CS148")...)
			r = append(r, "7376231CS151", "7376231CS152", "7376231CS154")
			return r
		}()},

		// S.No 10 - EW 104 - B.Tech. IT - 22IT002
		{HallNo: "EW 104", CourseCode: "22IT002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT131", "7376232IT132")
			r = append(r, expandRange("7376232IT134", "7376232IT136")...)
			r = append(r, "7376232IT139", "7376232IT140")
			r = append(r, expandRange("7376232IT142", "7376232IT148")...)
			r = append(r, "7376232IT151")
			return r
		}()},

		// S.No 11 - EW 105 - B.E. CS - 22CS002
		{HallNo: "EW 105", CourseCode: "22CS002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS155", "7376231CS159")...)
			r = append(r, "7376231CS161")
			r = append(r, expandRange("7376231CS163", "7376231CS166")...)
			return r
		}()},

		// S.No 12 - EW 105 - B.Tech. IT - 22IT002
		{HallNo: "EW 105", CourseCode: "22IT002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT152", "7376232IT160")...)
			r = append(r, expandRange("7376232IT163", "7376232IT168")...)
			return r
		}()},

		// S.No 13 - EW 106 - B.E. CS - 22CS002
		{HallNo: "EW 106", CourseCode: "22CS002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS333", "7376231CS334")
			r = append(r, expandRange("7376231CS337", "7376231CS342")...)
			r = append(r, "7376231CS344", "7376231CS346")
			return r
		}()},

		// S.No 14 - EW 106 - B.Tech. AL - 22AM014
		{HallNo: "EW 106", CourseCode: "22AM014", RegisterNos: expandRange("7376232AL110", "7376232AL124")},

		// S.No 15 - EW 107 - B.E. CS - 22CS031
		{HallNo: "EW 107", CourseCode: "22CS031", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS254")
			r = append(r, expandRange("7376231CS256", "7376231CS260")...)
			r = append(r, "7376231CS263", "7376231CS264", "7376231CS266", "7376231CS269")
			return r
		}()},

		// S.No 16 - EW 107 - B.E. EC - 22EC004
		{HallNo: "EW 107", CourseCode: "22EC004", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC244", "7376231EC247")...)
			r = append(r, "7376231EC249", "7376231EC250", "7376231EC252")
			r = append(r, expandRange("7376231EC255", "7376231EC261")...)
			r = append(r, "7376231EC263")
			return r
		}()},

		// S.No 17 - EW 108 - B.E. CS - 22CS031
		{HallNo: "EW 108", CourseCode: "22CS031", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS308", "7376231CS309", "7376231CS311", "7376231CS314", "7376231CS316",
				"7376231CS319", "7376231CS321")
			r = append(r, expandRange("7376231CS324", "7376231CS326")...)
			return r
		}()},

		// S.No 18 - EW 108 - B.E. EC - 22EC004
		{HallNo: "EW 108", CourseCode: "22EC004", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC298", "7376231EC299", "7376231EC302", "7376231EC303", "7376231EC306")
			r = append(r, expandRange("7376231EC308", "7376231EC313")...)
			r = append(r, "7376231EC315", "7376231EC316", "7376231EC318", "7376231EC319")
			return r
		}()},

		// S.No 19 - EW 109 - B.E. CS - 22CS031
		{HallNo: "EW 109", CourseCode: "22CS031", RegisterNos: expandRange("7376241CS503", "7376241CS512")},

		// S.No 20 - EW 109 - B.E. EC - 22EC004
		{HallNo: "EW 109", CourseCode: "22EC004", RegisterNos: expandRange("7376241EC501", "7376241EC515")},

		// S.No 21 - EW 111 - B.E. CS - 22CS002
		{HallNo: "EW 111", CourseCode: "22CS002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS114", "7376231CS115", "7376231CS117", "7376231CS120", "7376231CS124")
			r = append(r, expandRange("7376231CS127", "7376231CS129")...)
			r = append(r, "7376231CS133", "7376231CS135")
			return r
		}()},

		// S.No 22 - EW 111 - B.Tech. IT - 22IT002
		{HallNo: "EW 111", CourseCode: "22IT002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT112", "7376232IT113")
			r = append(r, expandRange("7376232IT115", "7376232IT117")...)
			r = append(r, "7376232IT119", "7376232IT120")
			r = append(r, expandRange("7376232IT122", "7376232IT126")...)
			r = append(r, expandRange("7376232IT128", "7376232IT130")...)
			return r
		}()},

		// S.No 23 - EW 112 - B.E. CS - 22CS002
		{HallNo: "EW 112", CourseCode: "22CS002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS168")
			r = append(r, expandRange("7376231CS171", "7376231CS173")...)
			r = append(r, expandRange("7376231CS175", "7376231CS178")...)
			r = append(r, "7376231CS185", "7376231CS187")
			return r
		}()},

		// S.No 24 - EW 112 - B.Tech. IT - 22IT002
		{HallNo: "EW 112", CourseCode: "22IT002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT170", "7376232IT180")...)
			r = append(r, expandRange("7376232IT182", "7376232IT185")...)
			return r
		}()},

		// S.No 25 - EW 113 - B.E. CD - 22CD019
		{HallNo: "EW 113", CourseCode: "22CD019", RegisterNos: []string{
			"7376221CD114", "7376221CD126", "7376221CD144",
		}},

		// S.No 26 - EW 113 - 22CD019
		{HallNo: "EW 113", CourseCode: "22CD019", RegisterNos: expandRange("7376231CD102", "7376231CD108")},

		// S.No 27 - EW 113 - B.Tech. BT - 22BT046
		{HallNo: "EW 113", CourseCode: "22BT046", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT209")
			r = append(r, expandRange("7376232BT211", "7376232BT213")...)
			r = append(r, "7376232BT215")
			return r
		}()},

		// S.No 28 - EW 113 - B.Tech. AD - 22AI032
		{HallNo: "EW 113", CourseCode: "22AI032", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD135")
			r = append(r, expandRange("7376232AD137", "7376232AD139")...)
			r = append(r, "7376232AD141", "7376232AD144", "7376232AD146", "7376232AD151", "7376232AD152", "7376232AD157")
			return r
		}()},

		// S.No 29 - EW 114 - B.E. EE - 22EE035
		{HallNo: "EW 114", CourseCode: "22EE035", RegisterNos: expandRange("7376231EE114", "7376231EE128")},

		// S.No 30 - EW 114 - B.Tech. CT - 22CT025
		{HallNo: "EW 114", CourseCode: "22CT025", RegisterNos: []string{"7376232CT101"}},

		// S.No 31 - EW 114 - B.Tech. AD - 22AI032
		{HallNo: "EW 114", CourseCode: "22AI032", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AD282", "7376232AD286")...)
			r = append(r, "7376242AD501", "7376242AD504", "7376242AD508", "7376242AD509")
			return r
		}()},

		// S.No 32 - EW 115 - B.Tech. CB - 22CB021
		{HallNo: "EW 115", CourseCode: "22CB021", RegisterNos: []string{"7376222CB121"}},

		// S.No 33 - EW 115 - B.E. EE - 22EE035
		{HallNo: "EW 115", CourseCode: "22EE035", RegisterNos: expandRange("7376241EE503", "7376241EE506")},

		// S.No 34 - EW 115 - B.Tech. CB - 22CB021
		{HallNo: "EW 115", CourseCode: "22CB021", RegisterNos: expandRange("7376232CB101", "7376232CB110")},

		// S.No 35 - EW 115 - B.Tech. CT - 22CT025
		{HallNo: "EW 115", CourseCode: "22CT025", RegisterNos: expandRange("7376232CT137", "7376232CT146")},

		// S.No 36 - EW 116 - B.Tech. CB - 22CB021
		{HallNo: "EW 116", CourseCode: "22CB021", RegisterNos: expandRange("7376232CB111", "7376232CB125")},

		// S.No 37 - EW 116 - B.Tech. CT - 22CT025
		{HallNo: "EW 116", CourseCode: "22CT025", RegisterNos: expandRange("7376232CT147", "7376232CT156")},

		// S.No 38 - EW 117 - B.E. EI - 22EI017
		{HallNo: "EW 117", CourseCode: "22EI017", RegisterNos: expandRange("7376231EI101", "7376231EI110")},

		// S.No 39 - EW 117 - B.Tech. CB - 22CB021
		{HallNo: "EW 117", CourseCode: "22CB021", RegisterNos: expandRange("7376232CB142", "7376232CB156")},

		// S.No 40 - EW 118 - B.E. EI - 22EI017
		{HallNo: "EW 118", CourseCode: "22EI017", RegisterNos: expandRange("7376231EI121", "7376231EI130")},

		// S.No 41 - EW 118 - B.E. SE - 22IS001
		{HallNo: "EW 118", CourseCode: "22IS001", RegisterNos: expandRange("7376231SE104", "7376231SE118")},

		// S.No 42 - EW 201 - B.Tech. AD - 22AI025
		{HallNo: "EW 201", CourseCode: "22AI025", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD126")
			r = append(r, expandRange("7376232AD128", "7376232AD130")...)
			r = append(r, "7376232AD133", "7376232AD136", "7376232AD140", "7376232AD142", "7376232AD143", "7376232AD145")
			return r
		}()},

		// S.No 43 - EW 201 - B.Tech. AL - 22AM014
		{HallNo: "EW 201", CourseCode: "22AM014", RegisterNos: expandRange("7376232AL155", "7376232AL169")},

		// S.No 44 - EW 202 - B.Tech. AD - 22AI025
		{HallNo: "EW 202", CourseCode: "22AI025", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD162")
			r = append(r, expandRange("7376232AD164", "7376232AD168")...)
			r = append(r, "7376232AD172")
			r = append(r, expandRange("7376232AD178", "7376232AD180")...)
			return r
		}()},

		// S.No 45 - EW 202 - B.Tech. AL - 22AM014
		{HallNo: "EW 202", CourseCode: "22AM014", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL185", "7376232AL193")...)
			r = append(r, expandRange("7376232AL195", "7376232AL200")...)
			return r
		}()},

		// S.No 46 - EW 203 - B.E. CD - 22CD019
		{HallNo: "EW 203", CourseCode: "22CD019", RegisterNos: expandRange("7376231CD109", "7376231CD123")},

		// S.No 47 - EW 203 - B.Tech. AD - 22AI032
		{HallNo: "EW 203", CourseCode: "22AI032", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD159", "7376232AD160", "7376232AD163")
			r = append(r, expandRange("7376232AD169", "7376232AD171")...)
			r = append(r, expandRange("7376232AD173", "7376232AD176")...)
			return r
		}()},

		// S.No 48 - EW 204 - B.E. CD - 22CD019
		{HallNo: "EW 204", CourseCode: "22CD019", RegisterNos: []string{"7376231CD503"}},

		// S.No 49 - EW 204 - 22CD019
		{HallNo: "EW 204", CourseCode: "22CD019", RegisterNos: expandRange("7376231CD154", "7376231CD162")},

		// S.No 50 - EW 204 - B.Tech. AD - 22AI032
		{HallNo: "EW 204", CourseCode: "22AI032", RegisterNos: []string{
			"7376232AD227", "7376232AD230", "7376232AD231", "7376232AD233", "7376232AD234",
			"7376232AD237", "7376232AD239", "7376232AD242", "7376232AD243", "7376232AD250",
		}},

		// S.No 51 - EW 205 - B.E. EE - 22EE035
		{HallNo: "EW 205", CourseCode: "22EE035", RegisterNos: expandRange("7376231EE129", "7376231EE138")},

		// S.No 52 - EW 205 - B.Tech. CT - 22CT025
		{HallNo: "EW 205", CourseCode: "22CT025", RegisterNos: expandRange("7376232CT102", "7376232CT111")},

		// S.No 53 - EW 206 - B.E. EE - 22EE035
		{HallNo: "EW 206", CourseCode: "22EE035", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EE139", "7376231EE161")...)
			r = append(r, "7376241EE501", "7376241EE502")
			return r
		}()},

		// S.No 54 - EW 206 - B.Tech. CT - 22CT025
		{HallNo: "EW 206", CourseCode: "22CT025", RegisterNos: expandRange("7376232CT112", "7376232CT136")},

		// S.No 55 - EW 207 - B.E. CS - 22CS002
		{HallNo: "EW 207", CourseCode: "22CS002", RegisterNos: []string{
			"7376231CS312", "7376231CS313", "7376231CS315", "7376231CS317", "7376231CS318",
			"7376231CS320", "7376231CS323", "7376231CS329", "7376231CS331", "7376231CS332",
		}},

		// S.No 56 - EW 207 - B.Tech. IT - 22IT002
		{HallNo: "EW 207", CourseCode: "22IT002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT281")
			r = append(r, expandRange("7376232IT283", "7376232IT286")...)
			r = append(r, "7376242IT510")
			return r
		}()},

		// S.No 57 - EW 207 - B.Tech. AL - 22AM014
		{HallNo: "EW 207", CourseCode: "22AM014", RegisterNos: expandRange("7376232AL101", "7376232AL109")},

		// S.No 58 - EW 208 - B.E. CS - 22CS002
		{HallNo: "EW 208", CourseCode: "22CS002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS347", "7376231CS350")...)
			r = append(r, "7376231CS352", "7376231CS354", "7376241CS513", "7376241CS515")
			return r
		}()},

		// S.No 59 - EW 208 - B.Tech. AD - 22AI025
		{HallNo: "EW 208", CourseCode: "22AI025", RegisterNos: []string{"7376232AD102", "7376232AD104"}},

		// S.No 60 - EW 208 - B.Tech. AL - 22AM014
		{HallNo: "EW 208", CourseCode: "22AM014", RegisterNos: expandRange("7376232AL125", "7376232AL139")},

		// S.No 61 - EW 209 - B.Tech. AD - 22AI025
		{HallNo: "EW 209", CourseCode: "22AI025", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AD147", "7376232AD150")...)
			r = append(r, expandRange("7376232AD153", "7376232AD156")...)
			r = append(r, "7376232AD158", "7376232AD161")
			return r
		}()},

		// S.No 62 - EW 209 - B.Tech. AL - 22AM014
		{HallNo: "EW 209", CourseCode: "22AM014", RegisterNos: expandRange("7376232AL170", "7376232AL184")},

		// S.No 63 - EW 210 - B.Tech. AD - 22AI025
		{HallNo: "EW 210", CourseCode: "22AI025", RegisterNos: []string{
			"7376232AD195", "7376232AD197", "7376232AD200", "7376232AD202", "7376232AD203",
			"7376232AD205", "7376232AD208", "7376232AD214", "7376232AD216", "7376232AD217",
		}},

		// S.No 64 - EW 210 - B.Tech. AL - 22AM014
		{HallNo: "EW 210", CourseCode: "22AM014", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL216", "7376232AL221")...)
			r = append(r, expandRange("7376242AL501", "7376242AL504")...)
			return r
		}()},

		// S.No 65 - EW 212 - B.Tech. BT - 22BT046
		{HallNo: "EW 212", CourseCode: "22BT046", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT152", "7376232BT168")...)
			r = append(r, "7376232BT170")
			r = append(r, expandRange("7376232BT172", "7376232BT174")...)
			r = append(r, "7376232BT176", "7376232BT179", "7376232BT180", "7376232BT182")
			return r
		}()},

		// S.No 66 - EW 212 - B.Tech. AD - 22AI025
		{HallNo: "EW 212", CourseCode: "22AI025", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD264")
			r = append(r, expandRange("7376232AD266", "7376232AD268")...)
			r = append(r, expandRange("7376232AD270", "7376232AD272")...)
			r = append(r, "7376232AD274", "7376232AD275", "7376232AD278", "7376232AD280", "7376232AD281")
			r = append(r, "7376242AD502", "7376242AD503")
			r = append(r, expandRange("7376242AD505", "7376242AD507")...)
			r = append(r, "7376242AD510")
			return r
		}()},

		// S.No 67 - EW 212 - 22AI032
		{HallNo: "EW 212", CourseCode: "22AI032", RegisterNos: []string{
			"7376232AD101", "7376232AD103", "7376232AD107", "7376232AD110",
			"7376232AD112", "7376232AD113", "7376232AD115",
		}},

		// S.No 68 - EW 213 - B.E. EI - 22EI017
		{HallNo: "EW 213", CourseCode: "22EI017", RegisterNos: expandRange("7376231EI131", "7376231EI140")},

		// S.No 69 - EW 213 - B.E. SE - 22IS001
		{HallNo: "EW 213", CourseCode: "22IS001", RegisterNos: expandRange("7376231SE119", "7376231SE133")},

		// S.No 70 - EW 214 - B.E. EI - 22EI017
		{HallNo: "EW 214", CourseCode: "22EI017", RegisterNos: expandRange("7376231EI141", "7376231EI150")},

		// S.No 71 - EW 214 - B.E. SE - 22IS001
		{HallNo: "EW 214", CourseCode: "22IS001", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE134", "7376231SE143")...)
			r = append(r, expandRange("7376231SE145", "7376231SE149")...)
			return r
		}()},

		// S.No 72 - EW 215 - B.E. BM - 22BM031
		{HallNo: "EW 215", CourseCode: "22BM031", RegisterNos: []string{"7376221BM109", "7376221BM128"}},

		// S.No 73 - EW 215 - B.E. SE - 22IS001
		{HallNo: "EW 215", CourseCode: "22IS001", RegisterNos: []string{"7376231SE504"}},

		// S.No 74 - EW 215 - B.E. EI - 22EI017
		{HallNo: "EW 215", CourseCode: "22EI017", RegisterNos: expandRange("7376231EI151", "7376231EI160")},

		// S.No 75 - EW 215 - B.E. BM - 22BM031
		{HallNo: "EW 215", CourseCode: "22BM031", RegisterNos: expandRange("7376231BM101", "7376231BM105")},

		// S.No 76 - EW 215 - B.E. SE - 22IS001
		{HallNo: "EW 215", CourseCode: "22IS001", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE150", "7376231SE155")...)
			r = append(r, "7376241SE501")
			return r
		}()},

		// S.No 77 - EW 218 - B.E. EI - 22EI017
		{HallNo: "EW 218", CourseCode: "22EI017", RegisterNos: []string{"7376231EI503"}},

		// S.No 78 - EW 218 - 22EI017
		{HallNo: "EW 218", CourseCode: "22EI017", RegisterNos: expandRange("7376241EI501", "7376241EI504")},

		// S.No 79 - EW 218 - B.E. BM - 22BM031
		{HallNo: "EW 218", CourseCode: "22BM031", RegisterNos: expandRange("7376231BM106", "7376231BM130")},

		// S.No 80 - EW 218 - B.E. MZ - 22MC026
		{HallNo: "EW 218", CourseCode: "22MC026", RegisterNos: expandRange("7376231MZ101", "7376231MZ120")},

		// S.No 81 - MH 301 - B.E. CS - 22CS031
		{HallNo: "MH 301", CourseCode: "22CS031", RegisterNos: []string{
			"7376221CS111", "7376221CS114", "7376221CS140", "7376221CS240", "7376221CS275",
		}},

		// S.No 82 - MH 301 - B.E. EC - 22EC004
		{HallNo: "MH 301", CourseCode: "22EC004", RegisterNos: []string{"7376221EC107"}},

		// S.No 83 - MH 301 - B.E. CS - 22CS031
		{HallNo: "MH 301", CourseCode: "22CS031", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS101", "7376231CS103")...)
			r = append(r, "7376231CS105", "7376231CS109")
			return r
		}()},

		// S.No 84 - MH 301 - B.E. EC - 22EC004
		{HallNo: "MH 301", CourseCode: "22EC004", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC102", "7376231EC106")...)
			r = append(r, expandRange("7376231EC110", "7376231EC113")...)
			r = append(r, expandRange("7376231EC115", "7376231EC119")...)
			return r
		}()},

		// S.No 85 - MH 302 - B.E. CS - 22CS031
		{HallNo: "MH 302", CourseCode: "22CS031", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS111", "7376231CS112", "7376231CS116", "7376231CS118", "7376231CS119")
			r = append(r, expandRange("7376231CS121", "7376231CS123")...)
			r = append(r, "7376231CS125", "7376231CS126")
			return r
		}()},

		// S.No 86 - MH 302 - B.E. EC - 22EC004
		{HallNo: "MH 302", CourseCode: "22EC004", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC120", "7376231EC131")...)
			r = append(r, expandRange("7376231EC133", "7376231EC135")...)
			return r
		}()},

		// S.No 87 - MH 303 - B.E. CS - 22CS031
		{HallNo: "MH 303", CourseCode: "22CS031", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS130", "7376231CS132")...)
			r = append(r, "7376231CS134", "7376231CS136", "7376231CS139", "7376231CS140")
			r = append(r, expandRange("7376231CS143", "7376231CS145")...)
			return r
		}()},

		// S.No 88 - MH 303 - B.E. EC - 22EC004
		{HallNo: "MH 303", CourseCode: "22EC004", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC136", "7376231EC137", "7376231EC139", "7376231EC140")
			r = append(r, expandRange("7376231EC142", "7376231EC150")...)
			r = append(r, "7376231EC152", "7376231EC154")
			return r
		}()},

		// S.No 89 - MH 305 - B.E. CS - 22CS031
		{HallNo: "MH 305", CourseCode: "22CS031", RegisterNos: []string{
			"7376231CS149", "7376231CS150", "7376231CS153", "7376231CS160", "7376231CS162",
			"7376231CS169", "7376231CS170", "7376231CS174", "7376231CS179", "7376231CS180",
		}},

		// S.No 90 - MH 305 - B.E. EC - 22EC004
		{HallNo: "MH 305", CourseCode: "22EC004", RegisterNos: expandRange("7376231EC155", "7376231EC169")},

		// S.No 91 - WW 005 - B.Tech. BT - 22BT046
		{HallNo: "WW 005", CourseCode: "22BT046", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT184", "7376232BT185", "7376232BT187", "7376232BT188")
			r = append(r, expandRange("7376232BT190", "7376232BT193")...)
			r = append(r, expandRange("7376232BT198", "7376232BT200")...)
			r = append(r, "7376232BT202", "7376232BT204", "7376232BT207", "7376232BT208")
			return r
		}()},

		// S.No 92 - WW 005 - B.Tech. AD - 22AI032
		{HallNo: "WW 005", CourseCode: "22AI032", RegisterNos: []string{
			"7376232AD116", "7376232AD117", "7376232AD119", "7376232AD120", "7376232AD122",
			"7376232AD124", "7376232AD127", "7376232AD131", "7376232AD132", "7376232AD134",
		}},

		// S.No 93 - WW 006 - B.E. CD - 22CD019
		{HallNo: "WW 006", CourseCode: "22CD019", RegisterNos: expandRange("7376231CD124", "7376231CD138")},

		// S.No 94 - WW 006 - B.Tech. AD - 22AI032
		{HallNo: "WW 006", CourseCode: "22AI032", RegisterNos: []string{
			"7376232AD177", "7376232AD182", "7376232AD183", "7376232AD188", "7376232AD191",
			"7376232AD196", "7376232AD198", "7376232AD199", "7376232AD201", "7376232AD204",
		}},

		// S.No 95 - WW 007 - B.E. CD - 22CD019
		{HallNo: "WW 007", CourseCode: "22CD019", RegisterNos: expandRange("7376231CD139", "7376231CD153")},

		// S.No 96 - WW 007 - B.Tech. AD - 22AI032
		{HallNo: "WW 007", CourseCode: "22AI032", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD206", "7376232AD207")
			r = append(r, expandRange("7376232AD209", "7376232AD213")...)
			r = append(r, "7376232AD215", "7376232AD221", "7376232AD222")
			return r
		}()},

		// S.No 97 - WW 008 - B.E. EE - 22EE035
		{HallNo: "WW 008", CourseCode: "22EE035", RegisterNos: expandRange("7376231EE102", "7376231EE113")},

		// S.No 98 - WW 008 - B.E. CD - 22CD019
		{HallNo: "WW 008", CourseCode: "22CD019", RegisterNos: expandRange("7376241CD501", "7376241CD503")},

		// S.No 99 - WW 008 - B.Tech. AD - 22AI032
		{HallNo: "WW 008", CourseCode: "22AI032", RegisterNos: []string{
			"7376232AD251", "7376232AD255", "7376232AD257", "7376232AD263", "7376232AD265",
			"7376232AD269", "7376232AD273", "7376232AD276", "7376232AD277", "7376232AD279",
		}},

		// S.No 100 - WW 011 - B.Tech. CT - 22CT025
		{HallNo: "WW 011", CourseCode: "22CT025", RegisterNos: []string{"7376232CT501"}},

		// S.No 101 - WW 011 - B.Tech. CB - 22CB021
		{HallNo: "WW 011", CourseCode: "22CB021", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB126", "7376232CB137")...)
			r = append(r, expandRange("7376232CB139", "7376232CB141")...)
			return r
		}()},

		// S.No 102 - WW 011 - B.Tech. CT - 22CT025
		{HallNo: "WW 011", CourseCode: "22CT025", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CT157", "7376232CT162")...)
			r = append(r, expandRange("7376242CT501", "7376242CT503")...)
			return r
		}()},

		// S.No 103 - WW 012 - B.E. SE - 22IS001
		{HallNo: "WW 012", CourseCode: "22IS001", RegisterNos: []string{
			"7376221SE123", "7376221SE131", "7376221SE134", "7376221SE140",
		}},

		// S.No 104 - WW 012 - B.E. EI - 22EI017
		{HallNo: "WW 012", CourseCode: "22EI017", RegisterNos: expandRange("7376231EI111", "7376231EI120")},

		// S.No 105 - WW 012 - B.E. SE - 22IS001
		{HallNo: "WW 012", CourseCode: "22IS001", RegisterNos: expandRange("7376231SE101", "7376231SE103")},

		// S.No 106 - WW 012 - B.Tech. CB - 22CB021
		{HallNo: "WW 012", CourseCode: "22CB021", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CB157")
			r = append(r, expandRange("7376232CB159", "7376232CB163")...)
			r = append(r, "7376242CB502", "7376242CB503")
			return r
		}()},

		// S.No 107 - WW 113 - B.E. CS - 22CS031
		{HallNo: "WW 113", CourseCode: "22CS031", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS237", "7376231CS239")
			r = append(r, expandRange("7376231CS241", "7376231CS244")...)
			r = append(r, "7376231CS246", "7376231CS249", "7376231CS250", "7376231CS253")
			return r
		}()},

		// S.No 108 - WW 113 - B.E. EC - 22EC004
		{HallNo: "WW 113", CourseCode: "22EC004", RegisterNos: expandRange("7376231EC229", "7376231EC243")},

		// S.No 109 - WW 114 - B.E. CS - 22CS031
		{HallNo: "WW 114", CourseCode: "22CS031", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS270", "7376231CS277")...)
			r = append(r, "7376231CS281", "7376231CS282")
			return r
		}()},

		// S.No 110 - WW 114 - B.E. EC - 22EC004
		{HallNo: "WW 114", CourseCode: "22EC004", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC264", "7376231EC273")...)
			r = append(r, expandRange("7376231EC275", "7376231EC277")...)
			r = append(r, "7376231EC279", "7376231EC280")
			return r
		}()},

		// S.No 111 - WW 115 - B.E. CS - 22CS031
		{HallNo: "WW 115", CourseCode: "22CS031", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS328", "7376231CS330", "7376231CS335", "7376231CS336",
				"7376231CS343", "7376231CS345", "7376231CS351", "7376231CS353",
				"7376241CS501", "7376241CS502")
			return r
		}()},

		// S.No 112 - WW 115 - B.E. EC - 22EC004
		{HallNo: "WW 115", CourseCode: "22EC004", RegisterNos: expandRange("7376231EC320", "7376231EC334")},

		// S.No 113 - WW 117 - B.E. CS - 22CS002
		{HallNo: "WW 117", CourseCode: "22CS002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS104")
			r = append(r, expandRange("7376231CS106", "7376231CS108")...)
			r = append(r, "7376231CS110", "7376231CS113")
			return r
		}()},

		// S.No 114 - WW 117 - 22CS031
		{HallNo: "WW 117", CourseCode: "22CS031", RegisterNos: []string{
			"7376241CS514", "7376241CS516", "7376241CS518", "7376241CS519",
		}},

		// S.No 115 - WW 117 - B.E. EC - 22EC004
		{HallNo: "WW 117", CourseCode: "22EC004", RegisterNos: expandRange("7376241EC516", "7376241EC522")},

		// S.No 116 - WW 117 - B.Tech. IT - 22IT002
		{HallNo: "WW 117", CourseCode: "22IT002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT101", "7376232IT103", "7376232IT104")
			r = append(r, expandRange("7376232IT106", "7376232IT110")...)
			return r
		}()},

		// S.No 117 - WW 118 - B.E. CS - 22CS002
		{HallNo: "WW 118", CourseCode: "22CS002", RegisterNos: []string{
			"7376231CS189", "7376231CS191", "7376231CS193", "7376231CS195", "7376231CS197",
			"7376231CS198", "7376231CS203", "7376231CS205", "7376231CS208", "7376231CS209",
		}},

		// S.No 118 - WW 118 - B.Tech. IT - 22IT002
		{HallNo: "WW 118", CourseCode: "22IT002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT186", "7376232IT190")...)
			r = append(r, expandRange("7376232IT192", "7376232IT195")...)
			r = append(r, expandRange("7376232IT200", "7376232IT204")...)
			r = append(r, "7376232IT208")
			return r
		}()},

		// S.No 119 - WW 202 - B.E. CS - 22CS002
		{HallNo: "WW 202", CourseCode: "22CS002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS211")
			r = append(r, expandRange("7376231CS213", "7376231CS215")...)
			r = append(r, expandRange("7376231CS217", "7376231CS220")...)
			r = append(r, "7376231CS224", "7376231CS225")
			r = append(r, expandRange("7376231CS229", "7376231CS231")...)
			r = append(r, "7376231CS234", "7376231CS238", "7376231CS240", "7376231CS245", "7376231CS247",
				"7376231CS248", "7376231CS251", "7376231CS252", "7376231CS255", "7376231CS261",
				"7376231CS262", "7376231CS265")
			return r
		}()},

		// S.No 120 - WW 202 - B.Tech. IT - 22IT002
		{HallNo: "WW 202", CourseCode: "22IT002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT210")
			r = append(r, expandRange("7376232IT213", "7376232IT216")...)
			r = append(r, "7376232IT218", "7376232IT219")
			r = append(r, expandRange("7376232IT221", "7376232IT226")...)
			r = append(r, "7376232IT228", "7376232IT229")
			r = append(r, expandRange("7376232IT231", "7376232IT234")...)
			r = append(r, expandRange("7376232IT236", "7376232IT241")...)
			return r
		}()},

		// S.No 121 - WW 203 - B.E. CS - 22CS002
		{HallNo: "WW 203", CourseCode: "22CS002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS267", "7376231CS268")
			r = append(r, expandRange("7376231CS278", "7376231CS280")...)
			r = append(r, "7376231CS284", "7376231CS285", "7376231CS287", "7376231CS290", "7376231CS291")
			return r
		}()},

		// S.No 122 - WW 203 - B.Tech. IT - 22IT002
		{HallNo: "WW 203", CourseCode: "22IT002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT242", "7376232IT246")...)
			r = append(r, expandRange("7376232IT248", "7376232IT250")...)
			r = append(r, "7376232IT253", "7376232IT255", "7376232IT256")
			r = append(r, expandRange("7376232IT258", "7376232IT261")...)
			return r
		}()},

		// S.No 123 - WW 204 - B.Tech. AD - 22AI025
		{HallNo: "WW 204", CourseCode: "22AI025", RegisterNos: []string{
			"7376232AD105", "7376232AD106", "7376232AD108", "7376232AD109", "7376232AD111",
			"7376232AD114", "7376232AD118", "7376232AD121", "7376232AD123", "7376232AD125",
		}},

		// S.No 124 - WW 204 - B.Tech. AL - 22AM014
		{HallNo: "WW 204", CourseCode: "22AM014", RegisterNos: expandRange("7376232AL140", "7376232AL154")},

		// S.No 125 - WW 205 - B.Tech. BT - 22BT046
		{HallNo: "WW 205", CourseCode: "22BT046", RegisterNos: expandRange("7376232BT101", "7376232BT112")},

		// S.No 126 - WW 205 - B.Tech. AD - 22AI025
		{HallNo: "WW 205", CourseCode: "22AI025", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AD218", "7376232AD220")...)
			r = append(r, expandRange("7376232AD223", "7376232AD226")...)
			r = append(r, "7376232AD228", "7376232AD229", "7376232AD232")
			return r
		}()},

		// S.No 127 - WW 205 - B.Tech. AL - 22AM014
		{HallNo: "WW 205", CourseCode: "22AM014", RegisterNos: expandRange("7376242AL505", "7376242AL507")},

		// S.No 128 - WW 211 - B.E. CS - 22CS002
		{HallNo: "WW 211", CourseCode: "22CS002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS293", "7376231CS296", "7376231CS297", "7376231CS300", "7376231CS301",
				"7376231CS303")
			r = append(r, expandRange("7376231CS305", "7376231CS307")...)
			r = append(r, "7376231CS310")
			return r
		}()},

		// S.No 129 - WW 211 - B.Tech. IT - 22IT002
		{HallNo: "WW 211", CourseCode: "22IT002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT262", "7376232IT270")...)
			r = append(r, "7376232IT272", "7376232IT273", "7376232IT275", "7376232IT276",
				"7376232IT279", "7376232IT280")
			return r
		}()},

		// S.No 130 - WW 212 - B.Tech. FT - 22FT022
		{HallNo: "WW 212", CourseCode: "22FT022", RegisterNos: []string{"7376222FT115"}},

		// S.No 131 - WW 212 - B.Tech. IT - 22IT025
		{HallNo: "WW 212", CourseCode: "22IT025", RegisterNos: []string{"7376222IT110"}},

		// S.No 132 - WW 212 - B.E. CE - 22CE020
		{HallNo: "WW 212", CourseCode: "22CE020", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CE109", "7376231CE129")...)
			r = append(r, expandRange("7376241CE501", "7376241CE504")...)
			return r
		}()},

		// S.No 133 - WW 212 - B.Tech. FT - 22FT022
		{HallNo: "WW 212", CourseCode: "22FT022", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FT101", "7376232FT106")...)
			r = append(r, expandRange("7376232FT108", "7376232FT120")...)
			r = append(r, "7376242FT501")
			return r
		}()},

		// S.No 134 - WW 213 - B.Tech. AD - 22AI025
		{HallNo: "WW 213", CourseCode: "22AI025", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD181")
			r = append(r, expandRange("7376232AD184", "7376232AD187")...)
			r = append(r, "7376232AD189", "7376232AD190")
			r = append(r, expandRange("7376232AD192", "7376232AD194")...)
			return r
		}()},

		// S.No 135 - WW 213 - B.Tech. AL - 22AM014
		{HallNo: "WW 213", CourseCode: "22AM014", RegisterNos: expandRange("7376232AL201", "7376232AL215")},

		// S.No 136 - WW 214 - B.Tech. BT - 22BT046
		{HallNo: "WW 214", CourseCode: "22BT046", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT113")
			r = append(r, expandRange("7376232BT115", "7376232BT117")...)
			r = append(r, expandRange("7376232BT119", "7376232BT123")...)
			r = append(r, expandRange("7376232BT125", "7376232BT127")...)
			r = append(r, expandRange("7376232BT129", "7376232BT131")...)
			return r
		}()},

		// S.No 137 - WW 214 - B.Tech. AD - 22AI025
		{HallNo: "WW 214", CourseCode: "22AI025", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD235", "7376232AD236", "7376232AD238", "7376232AD240", "7376232AD241")
			r = append(r, expandRange("7376232AD244", "7376232AD248")...)
			return r
		}()},

		// S.No 138 - WW 215 - B.Tech. BT - 22BT046
		{HallNo: "WW 215", CourseCode: "22BT046", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT132", "7376232BT139")...)
			r = append(r, "7376232BT141")
			r = append(r, expandRange("7376232BT144", "7376232BT148")...)
			r = append(r, "7376232BT151")
			return r
		}()},

		// S.No 139 - WW 215 - B.Tech. AD - 22AI025
		{HallNo: "WW 215", CourseCode: "22AI025", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD249")
			r = append(r, expandRange("7376232AD252", "7376232AD254")...)
			r = append(r, "7376232AD256")
			r = append(r, expandRange("7376232AD258", "7376232AD262")...)
			return r
		}()},

		// S.No 140 - WW 218 - B.E. BM - 22BM031
		{HallNo: "WW 218", CourseCode: "22BM031", RegisterNos: expandRange("7376231BM131", "7376231BM145")},

		// S.No 141 - WW 218 - B.E. MZ - 22MC026
		{HallNo: "WW 218", CourseCode: "22MC026", RegisterNos: expandRange("7376231MZ121", "7376231MZ130")},

		// S.No 142 - WW 219 - B.E. BM - 22BM031
		{HallNo: "WW 219", CourseCode: "22BM031", RegisterNos: []string{"7376231BM501", "7376231BM502"}},

		// S.No 143 - WW 219 - 22BM031
		{HallNo: "WW 219", CourseCode: "22BM031", RegisterNos: expandRange("7376231BM146", "7376231BM151")},

		// S.No 144 - WW 219 - B.E. MZ - 22MC026
		{HallNo: "WW 219", CourseCode: "22MC026", RegisterNos: expandRange("7376231MZ131", "7376231MZ140")},

		// S.No 145 - WW 219 - B.Tech. IT - 22IT020
		{HallNo: "WW 219", CourseCode: "22IT020", RegisterNos: []string{
			"7376232IT102", "7376232IT105", "7376232IT111", "7376232IT114",
			"7376232IT118", "7376232IT121", "7376232IT127",
		}},

		// S.No 146 - WW 222 - B.E. MZ - 22MC026
		{HallNo: "WW 222", CourseCode: "22MC026", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231MZ141", "7376231MZ158")...)
			r = append(r, expandRange("7376241MZ501", "7376241MZ506")...)
			return r
		}()},

		// S.No 147 - WW 222 - B.Tech. IT - 22IT020
		{HallNo: "WW 222", CourseCode: "22IT020", RegisterNos: []string{
			"7376232IT133", "7376232IT137", "7376232IT138", "7376232IT141", "7376232IT149",
			"7376232IT150", "7376232IT162", "7376232IT169", "7376232IT181", "7376232IT191",
			"7376232IT196", "7376232IT197", "7376232IT198", "7376232IT199", "7376232IT205",
			"7376232IT206", "7376232IT207", "7376232IT209", "7376232IT211", "7376232IT212",
			"7376232IT217", "7376232IT220", "7376232IT230", "7376232IT235", "7376232IT247",
		}},

		// S.No 148 - WW 222 - B.Tech. AG - 22AG001
		{HallNo: "WW 222", CourseCode: "22AG001", RegisterNos: []string{"7376232AG102"}},

		// S.No 149 - WW 223 - B.E. EC - 22EC006
		{HallNo: "WW 223", CourseCode: "22EC006", RegisterNos: []string{"7376221EC102"}},

		// S.No 150 - WW 223 - 22EC006
		{HallNo: "WW 223", CourseCode: "22EC006", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC101")
			r = append(r, expandRange("7376231EC107", "7376231EC109")...)
			r = append(r, "7376231EC114", "7376231EC132", "7376231EC138")
			return r
		}()},

		// S.No 151 - WW 223 - B.Tech. IT - 22IT020
		{HallNo: "WW 223", CourseCode: "22IT020", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT251", "7376232IT252", "7376232IT254", "7376232IT257",
				"7376232IT271", "7376232IT274", "7376232IT277", "7376232IT278")
			r = append(r, expandRange("7376242IT501", "7376242IT505")...)
			r = append(r, expandRange("7376242IT507", "7376242IT509")...)
			r = append(r, "7376242IT511")
			return r
		}()},

		// S.No 152 - WW 223 - B.Tech. AG - 22AG001
		{HallNo: "WW 223", CourseCode: "22AG001", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG103", "7376232AG109")...)
			r = append(r, expandRange("7376232AG111", "7376232AG128")...)
			return r
		}()},

		// S.No 153 - WW 224 - B.E. EC - 22EC006
		{HallNo: "WW 224", CourseCode: "22EC006", RegisterNos: []string{
			"7376231EC141", "7376231EC151", "7376231EC153", "7376231EC170", "7376231EC179",
			"7376231EC185", "7376231EC190", "7376231EC196", "7376231EC201", "7376231EC202",
			"7376231EC205", "7376231EC209", "7376231EC214", "7376231EC216", "7376231EC217",
			"7376231EC218", "7376231EC221", "7376231EC248", "7376231EC251", "7376231EC253",
			"7376231EC254", "7376231EC262", "7376231EC274", "7376231EC278", "7376231EC285",
		}},

		// S.No 154 - WW 224 - B.Tech. AG - 22AG001
		{HallNo: "WW 224", CourseCode: "22AG001", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AG129")
			r = append(r, expandRange("7376232AG131", "7376232AG154")...)
			return r
		}()},

		// S.No 155 - WW 225 - B.E. ME - 22ME013
		{HallNo: "WW 225", CourseCode: "22ME013", RegisterNos: []string{
			"7376221ME111", "7376221ME138", "7376221ME154",
		}},

		// S.No 156 - WW 225 - B.Tech. FD - 22FD008
		{HallNo: "WW 225", CourseCode: "22FD008", RegisterNos: []string{
			"7376222FD107", "7376222FD121", "7376222FD125",
		}},

		// S.No 157 - WW 225 - B.E. EC - 22EC006
		{HallNo: "WW 225", CourseCode: "22EC006", RegisterNos: []string{
			"7376231EC297", "7376231EC300", "7376231EC301", "7376231EC304",
			"7376231EC305", "7376231EC307", "7376231EC314", "7376231EC317",
		}},

		// S.No 158 - WW 225 - B.E. ME - 22ME013
		{HallNo: "WW 225", CourseCode: "22ME013", RegisterNos: []string{
			"7376231ME101", "7376231ME106", "7376231ME107", "7376231ME111", "7376231ME115",
			"7376231ME117", "7376231ME121", "7376231ME122", "7376231ME128", "7376231ME129",
			"7376231ME134", "7376231ME135", "7376231ME142", "7376231ME145",
		}},

		// S.No 159 - WW 225 - B.Tech. FD - 22FD008
		{HallNo: "WW 225", CourseCode: "22FD008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FD101", "7376232FD103")...)
			r = append(r, expandRange("7376232FD105", "7376232FD119")...)
			return r
		}()},

		// S.No 160 - WW 225 - B.Tech. AG - 22AG001
		{HallNo: "WW 225", CourseCode: "22AG001", RegisterNos: expandRange("7376242AG501", "7376242AG504")},

		// S.No 161 - WW 226 - B.E. CS - 22CS025
		{HallNo: "WW 226", CourseCode: "22CS025", RegisterNos: []string{
			"7376221CS109", "7376221CS118", "7376221CS217", "7376221CS288", "7376221CS322", "7376231CS512",
		}},

		// S.No 162 - WW 226 - B.E. MC - 22MC026
		{HallNo: "WW 226", CourseCode: "22MC026", RegisterNos: []string{"7376231MC506"}},

		// S.No 163 - WW 226 - B.E. ME - 22ME013
		{HallNo: "WW 226", CourseCode: "22ME013", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231ME147", "7376231ME148", "7376231ME152", "7376231ME153")
			r = append(r, expandRange("7376231ME155", "7376231ME158")...)
			r = append(r, "7376231ME161", "7376241ME503")
			return r
		}()},

		// S.No 164 - WW 226 - 22ME058
		{HallNo: "WW 226", CourseCode: "22ME058", RegisterNos: []string{"7376231ME102"}},

		// S.No 165 - WW 226 - B.Tech. FD - 22FD008
		{HallNo: "WW 226", CourseCode: "22FD008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232FD120")
			r = append(r, expandRange("7376232FD122", "7376232FD152")...)
			return r
		}()},

		// S.No 166 - WW 227 - B.E. CE - 22CE020
		{HallNo: "WW 227", CourseCode: "22CE020", RegisterNos: []string{"7376221CE124", "7376221CE138"}},

		// S.No 167 - WW 227 - 22CE020
		{HallNo: "WW 227", CourseCode: "22CE020", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CE101")
			r = append(r, expandRange("7376231CE103", "7376231CE108")...)
			return r
		}()},

		// S.No 168 - WW 227 - B.E. ME - 22ME058
		{HallNo: "WW 227", CourseCode: "22ME058", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231ME103", "7376231ME105")...)
			r = append(r, expandRange("7376231ME108", "7376231ME110")...)
			r = append(r, expandRange("7376231ME112", "7376231ME114")...)
			r = append(r, "7376231ME116")
			r = append(r, expandRange("7376231ME118", "7376231ME120")...)
			r = append(r, expandRange("7376231ME123", "7376231ME127")...)
			r = append(r, expandRange("7376231ME130", "7376231ME133")...)
			r = append(r, expandRange("7376231ME136", "7376231ME141")...)
			r = append(r, "7376231ME143", "7376231ME144", "7376231ME146")
			r = append(r, expandRange("7376231ME149", "7376231ME151")...)
			r = append(r, "7376231ME154", "7376231ME159", "7376231ME160")
			r = append(r, "7376241ME501", "7376241ME502", "7376241ME504", "7376241ME505")
			return r
		}()},
	}
}
func buildSeatingData06AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 206 - B.E. CE - 22CE008
		{HallNo: "EW 206", CourseCode: "22CE008", RegisterNos: []string{
			"7376221CE124", "7376231CE503",
		}},

		// S.No 2 - EW 206 - B.E. CS - 22CS026
		{HallNo: "EW 206", CourseCode: "22CS026", RegisterNos: []string{
			"7376221CS109", "7376221CS111",
			"7376221CS116", "7376221CS118",
			"7376221CS196", "7376221CS240",
			"7376221CS275", "7376231CS501",
			"7376231CS506", "7376231CS520",
		}},

		// S.No 3 - EW 206 - B.E. EC - 22EC021
		{HallNo: "EW 206", CourseCode: "22EC021", RegisterNos: []string{
			"7376221EC102", "7376221EC337",
			"7376231EC514",
		}},

		// S.No 4 - EW 206 - 22EC043
		{HallNo: "EW 206", CourseCode: "22EC043", RegisterNos: []string{
			"7376221EC107", "7376221EC226",
		}},

		// S.No 5 - EW 206 - B.E. ME - 22ME031
		{HallNo: "EW 206", CourseCode: "22ME031", RegisterNos: []string{
			"7376221ME111", "7376221ME114",
			"7376221ME138",
		}},

		// S.No 6 - EW 206 - B.E. MC - 22MC028
		{HallNo: "EW 206", CourseCode: "22MC028", RegisterNos: []string{
			"7376231MC506",
		}},

		// S.No 7 - EW 206 - B.E. BM - 22BM044
		{HallNo: "EW 206", CourseCode: "22BM044", RegisterNos: []string{
			"7376221BM128",
		}},

		// S.No 8 - EW 206 - B.Tech. BT - 22BT015
		{HallNo: "EW 206", CourseCode: "22BT015", RegisterNos: []string{
			"7376222BT110",
		}},

		// S.No 9 - EW 206 - B.Tech. FD - 22FD030
		{HallNo: "EW 206", CourseCode: "22FD030", RegisterNos: []string{
			"7376222FD107", "7376222FD125",
		}},

		// S.No 10 - EW 206 - B.Tech. AG - 22AG029
		{HallNo: "EW 206", CourseCode: "22AG029", RegisterNos: []string{
			"7376222AG116", "7376222AG120",
		}},
	}
}

func buildSeatingData07FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 302 - B.E. CS - 22CS008
		{HallNo: "AE 302", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS154", "7376241CS156")...)
			r = append(r, "7376241CS160")
			r = append(r, expandRange("7376241CS162", "7376241CS167")...)
			r = append(r, expandRange("7376241CS169", "7376241CS173")...)
			return r
		}()},

		// S.No 2 - AE 302 - B.Tech. IT - 22IT008
		{HallNo: "AE 302", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242IT139")
			r = append(r, expandRange("7376242IT141", "7376242IT145")...)
			r = append(r, "7376242IT147", "7376242IT148", "7376242IT151", "7376242IT152")
			return r
		}()},

		// S.No 3 - EW 101 - B.E. CS - 22CS008
		{HallNo: "EW 101", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS174", "7376241CS176")...)
			r = append(r, "7376241CS178")
			r = append(r, expandRange("7376241CS181", "7376241CS188")...)
			r = append(r, expandRange("7376241CS190", "7376241CS192")...)
			return r
		}()},

		// S.No 4 - EW 101 - B.Tech. IT - 22IT008
		{HallNo: "EW 101", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT155", "7376242IT157")...)
			r = append(r, "7376242IT159")
			r = append(r, expandRange("7376242IT162", "7376242IT164")...)
			r = append(r, expandRange("7376242IT166", "7376242IT168")...)
			return r
		}()},

		// S.No 5 - EW 102 - B.E. CS - 22CS008
		{HallNo: "EW 102", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS193", "7376241CS202")...)
			r = append(r, "7376241CS204", "7376241CS205")
			r = append(r, expandRange("7376241CS207", "7376241CS209")...)
			return r
		}()},

		// S.No 6 - EW 102 - B.Tech. IT - 22IT008
		{HallNo: "EW 102", CourseCode: "22IT008", RegisterNos: expandRange("7376242IT169", "7376242IT178")},

		// S.No 7 - EW 103 - B.E. CS - 22CS008
		{HallNo: "EW 103", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241CS263")
			r = append(r, expandRange("7376241CS265", "7376241CS272")...)
			r = append(r, expandRange("7376241CS274", "7376241CS279")...)
			return r
		}()},

		// S.No 8 - EW 103 - B.Tech. IT - 22IT008
		{HallNo: "EW 103", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242IT212", "7376242IT213")
			r = append(r, expandRange("7376242IT215", "7376242IT217")...)
			r = append(r, expandRange("7376242IT219", "7376242IT223")...)
			return r
		}()},

		// S.No 9 - EW 104 - B.E. CS - 22CS008
		{HallNo: "EW 104", CourseCode: "22CS008", RegisterNos: expandRange("7376241CS370", "7376241CS384")},

		// S.No 10 - EW 104 - B.Tech. IT - 22IT008
		{HallNo: "EW 104", CourseCode: "22IT008", RegisterNos: expandRange("7376242IT287", "7376242IT296")},

		// S.No 11 - EW 105 - B.E. CS - 22CS008
		{HallNo: "EW 105", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS385", "7376241CS388")...)
			r = append(r, expandRange("7376241CS390", "7376241CS393")...)
			r = append(r, "7376241CS395")
			r = append(r, expandRange("7376241CS397", "7376241CS399")...)
			r = append(r, "7376241CS401", "7376241CS402", "7376241CS404")
			return r
		}()},

		// S.No 12 - EW 105 - B.Tech. IT - 22IT008
		{HallNo: "EW 105", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242IT297")
			r = append(r, expandRange("7376242IT299", "7376242IT303")...)
			r = append(r, "7376242IT305", "7376242IT306", "7376242IT308", "7376242IT310")
			return r
		}()},

		// S.No 13 - EW 106 - B.E. EC - 22EC001
		{HallNo: "EW 106", CourseCode: "22EC001", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC141", "7376241EC145")...)
			r = append(r, "7376241EC148")
			r = append(r, expandRange("7376241EC151", "7376241EC153")...)
			r = append(r, "7376241EC156", "7376241EC157", "7376241EC160", "7376241EC164", "7376241EC168", "7376241EC171")
			return r
		}()},

		// S.No 14 - EW 106 - B.Tech. AD - 22AI002
		{HallNo: "EW 106", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD129", "7376242AD131", "7376242AD132", "7376242AD134",
				"7376242AD135", "7376242AD138", "7376242AD139", "7376242AD146",
				"7376242AD150", "7376242AD151")
			return r
		}()},

		// S.No 15 - EW 107 - B.E. CS - 22CS008
		{HallNo: "EW 107", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241CS227", "7376241CS228", "7376241CS231")
			r = append(r, expandRange("7376241CS233", "7376241CS244")...)
			return r
		}()},

		// S.No 16 - EW 107 - B.Tech. IT - 22IT008
		{HallNo: "EW 107", CourseCode: "22IT008", RegisterNos: expandRange("7376242IT192", "7376242IT201")},

		// S.No 17 - EW 108 - B.E. CS - 22CS008
		{HallNo: "EW 108", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241CS280")
			r = append(r, expandRange("7376241CS282", "7376241CS285")...)
			r = append(r, "7376241CS287", "7376241CS288")
			r = append(r, expandRange("7376241CS290", "7376241CS296")...)
			r = append(r, "7376241CS298")
			return r
		}()},

		// S.No 18 - EW 108 - B.Tech. IT - 22IT008
		{HallNo: "EW 108", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT224", "7376242IT226")...)
			r = append(r, expandRange("7376242IT228", "7376242IT231")...)
			r = append(r, expandRange("7376242IT233", "7376242IT235")...)
			return r
		}()},

		// S.No 19 - EW 109 - B.E. CS - 22CS008
		{HallNo: "EW 109", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS315", "7376241CS318")...)
			r = append(r, "7376241CS320", "7376241CS321")
			r = append(r, expandRange("7376241CS323", "7376241CS331")...)
			return r
		}()},

		// S.No 20 - EW 109 - B.Tech. IT - 22IT008
		{HallNo: "EW 109", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242IT253", "7376242IT254", "7376242IT256", "7376242IT257")
			r = append(r, expandRange("7376242IT259", "7376242IT264")...)
			return r
		}()},

		// S.No 21 - EW 111 - B.E. CS - 22CS008
		{HallNo: "EW 111", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241CS352", "7376241CS353")
			r = append(r, expandRange("7376241CS355", "7376241CS360")...)
			r = append(r, expandRange("7376241CS362", "7376241CS368")...)
			return r
		}()},

		// S.No 22 - EW 111 - B.Tech. IT - 22IT008
		{HallNo: "EW 111", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242IT275", "7376242IT277", "7376242IT278")
			r = append(r, expandRange("7376242IT280", "7376242IT286")...)
			return r
		}()},

		// S.No 23 - EW 112 - B.E. CS - 22CS008
		{HallNo: "EW 112", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS405", "7376241CS417")...)
			r = append(r, "7376241CS419", "7376241CS421")
			return r
		}()},

		// S.No 24 - EW 112 - B.Tech. IT - 22IT008
		{HallNo: "EW 112", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT311", "7376242IT314")...)
			r = append(r, expandRange("7376242IT316", "7376242IT319")...)
			r = append(r, "7376242IT321", "7376242IT322")
			return r
		}()},

		// S.No 25 - EW 113 - B.E. EC - 22EC040
		{HallNo: "EW 113", CourseCode: "22EC040", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC212", "7376241EC214")
			r = append(r, expandRange("7376241EC218", "7376241EC221")...)
			r = append(r, "7376241EC223", "7376241EC227", "7376241EC232", "7376241EC234",
				"7376241EC238", "7376241EC239", "7376241EC241", "7376241EC243", "7376241EC246")
			return r
		}()},

		// S.No 26 - EW 113 - B.Tech. AD - 22AI043
		{HallNo: "EW 113", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD143", "7376242AD145")...)
			r = append(r, expandRange("7376242AD147", "7376242AD149")...)
			r = append(r, "7376242AD154", "7376242AD158", "7376242AD160", "7376242AD161")
			return r
		}()},

		// S.No 27 - EW 114 - B.Tech. BT - 22BT003
		{HallNo: "EW 114", CourseCode: "22BT003", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242BT117", "7376242BT118")
			r = append(r, expandRange("7376242BT121", "7376242BT133")...)
			return r
		}()},

		// S.No 28 - EW 114 - B.Tech. AD - 22AI043
		{HallNo: "EW 114", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD259", "7376242AD263")...)
			r = append(r, "7376242AD265", "7376242AD267", "7376242AD268", "7376242AD271", "7376242AD272")
			return r
		}()},

		// S.No 29 - EW 115 - B.E. EE - 22EE007
		{HallNo: "EW 115", CourseCode: "22EE007", RegisterNos: []string{
			"7376231EE104", "7376231EE111",
		}},

		// S.No 30 - EW 115 - B.Tech. BT - 22BT003
		{HallNo: "EW 115", CourseCode: "22BT003", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242BT177", "7376242BT178")
			r = append(r, expandRange("7376242BT180", "7376242BT189")...)
			r = append(r, expandRange("7376242BT191", "7376242BT193")...)
			return r
		}()},

		// S.No 31 - EW 115 - B.Tech. AD - 22AI043
		{HallNo: "EW 115", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD346")
			r = append(r, expandRange("7376252AD501", "7376252AD503")...)
			r = append(r, "7376252AD507", "7376252AD510", "7376252AD512", "7376252AD514")
			return r
		}()},

		// S.No 32 - EW 116 - B.E. EE - 22EE007
		{HallNo: "EW 116", CourseCode: "22EE007", RegisterNos: []string{"7376231EE504"}},

		// S.No 33 - EW 116 - 22EE007
		{HallNo: "EW 116", CourseCode: "22EE007", RegisterNos: []string{"7376231EE115"}},

		// S.No 34 - EW 116 - 22EE007
		{HallNo: "EW 116", CourseCode: "22EE007", RegisterNos: []string{
			"7376241EE101", "7376241EE103",
			"7376241EE105", "7376241EE108",
			"7376241EE109", "7376241EE111",
			"7376241EE113", "7376241EE114",
		}},

		// S.No 35 - EW 116 - B.Tech. BT - 22BT003
		{HallNo: "EW 116", CourseCode: "22BT003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT195", "7376242BT204")...)
			r = append(r, expandRange("7376242BT206", "7376242BT210")...)
			return r
		}()},

		// S.No 36 - EW 117 - B.E. EE - 22EE007
		{HallNo: "EW 117", CourseCode: "22EE007", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EE133", "7376241EE134")
			r = append(r, expandRange("7376241EE137", "7376241EE144")...)
			return r
		}()},

		// S.No 37 - EW 117 - B.E. MZ - 22MC013
		{HallNo: "EW 117", CourseCode: "22MC013", RegisterNos: expandRange("7376241MZ101", "7376241MZ115")},

		// S.No 38 - EW 118 - B.E. EE - 22EE007
		{HallNo: "EW 118", CourseCode: "22EE007", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE163", "7376241EE166")...)
			r = append(r, "7376241EE168", "7376241EE169", "7376241EE171")
			r = append(r, expandRange("7376241EE173", "7376241EE175")...)
			return r
		}()},

		// S.No 39 - EW 118 - B.E. MZ - 22MC013
		{HallNo: "EW 118", CourseCode: "22MC013", RegisterNos: expandRange("7376241MZ131", "7376241MZ145")},

		// S.No 40 - EW 201 - B.E. EC - 22EC001
		{HallNo: "EW 201", CourseCode: "22EC001", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC237", "7376241EC240", "7376241EC242", "7376241EC244",
				"7376241EC245", "7376241EC249", "7376241EC250", "7376241EC254",
				"7376241EC256", "7376241EC258", "7376241EC259", "7376241EC267",
				"7376241EC269", "7376241EC270", "7376241EC272")
			return r
		}()},

		// S.No 41 - EW 201 - B.Tech. AD - 22AI002
		{HallNo: "EW 201", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD200", "7376242AD203")...)
			r = append(r, "7376242AD207", "7376242AD209", "7376242AD210", "7376242AD212",
				"7376242AD214", "7376242AD217")
			return r
		}()},

		// S.No 42 - EW 202 - B.E. EC - 22EC001
		{HallNo: "EW 202", CourseCode: "22EC001", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC299", "7376241EC301")...)
			r = append(r, expandRange("7376241EC304", "7376241EC309")...)
			r = append(r, expandRange("7376241EC312", "7376241EC316")...)
			r = append(r, "7376241EC319")
			return r
		}()},

		// S.No 43 - EW 202 - B.Tech. AD - 22AI002
		{HallNo: "EW 202", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD232", "7376242AD235")...)
			r = append(r, expandRange("7376242AD240", "7376242AD242")...)
			r = append(r, "7376242AD244", "7376242AD246", "7376242AD248")
			return r
		}()},

		// S.No 44 - EW 203 - B.E. EC - 22EC040
		{HallNo: "EW 203", CourseCode: "22EC040", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC247", "7376241EC248")
			r = append(r, expandRange("7376241EC251", "7376241EC253")...)
			r = append(r, "7376241EC255", "7376241EC257")
			r = append(r, expandRange("7376241EC260", "7376241EC266")...)
			r = append(r, "7376241EC268")
			return r
		}()},

		// S.No 45 - EW 203 - B.Tech. AD - 22AI043
		{HallNo: "EW 203", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD162", "7376242AD167")...)
			r = append(r, expandRange("7376242AD170", "7376242AD172")...)
			r = append(r, "7376242AD175")
			return r
		}()},

		// S.No 46 - EW 204 - B.E. EC - 22EC040
		{HallNo: "EW 204", CourseCode: "22EC040", RegisterNos: []string{
			"7376241EC511", "7376241EC513",
			"7376241EC516", "7376241EC520",
		}},

		// S.No 47 - EW 204 - 22EC040
		{HallNo: "EW 204", CourseCode: "22EC040", RegisterNos: []string{
			"7376241EC345", "7376241EC346",
			"7376251EC506", "7376251EC515",
			"7376251EC517", "7376251EC518",
		}},

		// S.No 48 - EW 204 - B.Tech. AD - 22AI043
		{HallNo: "EW 204", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD215", "7376242AD216")
			r = append(r, expandRange("7376242AD224", "7376242AD226")...)
			r = append(r, "7376242AD231")
			r = append(r, expandRange("7376242AD236", "7376242AD239")...)
			return r
		}()},

		// S.No 49 - EW 205 - B.Tech. BT - 22BT003
		{HallNo: "EW 205", CourseCode: "22BT003", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242BT134", "7376242BT135", "7376242BT137")
			r = append(r, expandRange("7376242BT139", "7376242BT145")...)
			return r
		}()},

		// S.No 50 - EW 205 - B.Tech. AD - 22AI043
		{HallNo: "EW 205", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD274", "7376242AD277")...)
			r = append(r, "7376242AD279", "7376242AD281", "7376242AD283", "7376242AD284",
				"7376242AD288", "7376242AD290")
			return r
		}()},

		// S.No 51 - EW 206 - B.Tech. BT - 22BT003
		{HallNo: "EW 206", CourseCode: "22BT003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT146", "7376242BT149")...)
			r = append(r, expandRange("7376242BT152", "7376242BT160")...)
			r = append(r, expandRange("7376242BT163", "7376242BT168")...)
			r = append(r, expandRange("7376242BT170", "7376242BT173")...)
			r = append(r, "7376242BT175", "7376242BT176")
			return r
		}()},

		// S.No 52 - EW 206 - B.Tech. AD - 22AI043
		{HallNo: "EW 206", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD291", "7376242AD294")...)
			r = append(r, expandRange("7376242AD297", "7376242AD302")...)
			r = append(r, "7376242AD305", "7376242AD306", "7376242AD309", "7376242AD315",
				"7376242AD317", "7376242AD319", "7376242AD321", "7376242AD323")
			r = append(r, expandRange("7376242AD326", "7376242AD328")...)
			r = append(r, "7376242AD336", "7376242AD337", "7376242AD341", "7376242AD343")
			return r
		}()},

		// S.No 53 - EW 207 - B.E. EC - 22EC001
		{HallNo: "EW 207", CourseCode: "22EC001", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC115")
			r = append(r, expandRange("7376241EC118", "7376241EC125")...)
			r = append(r, "7376241EC131", "7376241EC133", "7376241EC134", "7376241EC136",
				"7376241EC137", "7376241EC140")
			return r
		}()},

		// S.No 54 - EW 207 - B.Tech. AD - 22AI002
		{HallNo: "EW 207", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD109", "7376242AD110")
			r = append(r, expandRange("7376242AD114", "7376242AD116")...)
			r = append(r, "7376242AD119", "7376242AD120", "7376242AD124", "7376242AD127", "7376242AD128")
			return r
		}()},

		// S.No 55 - EW 208 - B.E. EC - 22EC001
		{HallNo: "EW 208", CourseCode: "22EC001", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC172", "7376241EC174", "7376241EC176")
			r = append(r, expandRange("7376241EC178", "7376241EC180")...)
			r = append(r, "7376241EC182", "7376241EC183", "7376241EC186", "7376241EC189",
				"7376241EC195", "7376241EC197")
			r = append(r, expandRange("7376241EC202", "7376241EC204")...)
			return r
		}()},

		// S.No 56 - EW 208 - B.Tech. AD - 22AI002
		{HallNo: "EW 208", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD152", "7376242AD153")
			r = append(r, expandRange("7376242AD155", "7376242AD157")...)
			r = append(r, "7376242AD159", "7376242AD168", "7376242AD169", "7376242AD173", "7376242AD174")
			return r
		}()},

		// S.No 57 - EW 209 - B.E. EC - 22EC001
		{HallNo: "EW 209", CourseCode: "22EC001", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC274", "7376241EC277", "7376241EC279", "7376241EC281",
				"7376241EC284", "7376241EC285")
			r = append(r, expandRange("7376241EC288", "7376241EC292")...)
			r = append(r, expandRange("7376241EC295", "7376241EC298")...)
			return r
		}()},

		// S.No 58 - EW 209 - B.Tech. AD - 22AI002
		{HallNo: "EW 209", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD218", "7376242AD223")...)
			r = append(r, expandRange("7376242AD227", "7376242AD230")...)
			return r
		}()},

		// S.No 59 - EW 212 - 22AI002
		{HallNo: "EW 212", CourseCode: "22AI002", RegisterNos: []string{
			"7376242AD505", "7376242AD509",
		}},

		// S.No 60 - EW 212 - B.E. EC - 22EC040
		{HallNo: "EW 212", CourseCode: "22EC040", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC138", "7376241EC139", "7376241EC146", "7376241EC147",
				"7376241EC149", "7376241EC150", "7376241EC154", "7376241EC155",
				"7376241EC158", "7376241EC159")
			r = append(r, expandRange("7376241EC161", "7376241EC163")...)
			r = append(r, expandRange("7376241EC165", "7376241EC167")...)
			r = append(r, "7376241EC169", "7376241EC170", "7376241EC173", "7376241EC177",
				"7376241EC181", "7376241EC184", "7376241EC185", "7376241EC187", "7376241EC188")
			return r
		}()},

		// S.No 61 - EW 212 - B.Tech. AD - 22AI002
		{HallNo: "EW 212", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD339", "7376242AD340", "7376242AD342", "7376242AD344", "7376242AD345")
			r = append(r, expandRange("7376252AD504", "7376252AD506")...)
			r = append(r, "7376252AD508", "7376252AD509", "7376252AD511", "7376252AD513",
				"7376252AD515", "7376252AD516")
			return r
		}()},

		// S.No 62 - EW 212 - 22AI043
		{HallNo: "EW 212", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD102", "7376242AD106", "7376242AD108")
			r = append(r, expandRange("7376242AD111", "7376242AD113")...)
			r = append(r, "7376242AD117", "7376242AD118", "7376242AD121")
			return r
		}()},

		// S.No 63 - EW 213 - B.E. EE - 22EE007
		{HallNo: "EW 213", CourseCode: "22EE007", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EE176")
			r = append(r, expandRange("7376241EE178", "7376241EE183")...)
			r = append(r, expandRange("7376241EE185", "7376241EE187")...)
			return r
		}()},

		// S.No 64 - EW 213 - B.E. MZ - 22MC013
		{HallNo: "EW 213", CourseCode: "22MC013", RegisterNos: expandRange("7376241MZ146", "7376241MZ160")},

		// S.No 65 - EW 214 - 22MC013
		{HallNo: "EW 214", CourseCode: "22MC013", RegisterNos: []string{"7376241MZ501"}},

		// S.No 66 - EW 214 - B.E. EE - 22EE007
		{HallNo: "EW 214", CourseCode: "22EE007", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EE191", "7376241EE192", "7376241EE194", "7376241EE195",
				"7376241EE197", "7376241EE198")
			r = append(r, expandRange("7376241EE200", "7376241EE203")...)
			return r
		}()},

		// S.No 67 - EW 214 - B.E. ME - 22ME001
		{HallNo: "EW 214", CourseCode: "22ME001", RegisterNos: expandRange("7376241ME102", "7376241ME109")},

		// S.No 68 - EW 214 - B.E. MZ - 22MC013
		{HallNo: "EW 214", CourseCode: "22MC013", RegisterNos: expandRange("7376251MZ501", "7376251MZ506")},

		// S.No 69 - EW 215 - B.E. EE - 22EE007
		{HallNo: "EW 215", CourseCode: "22EE007", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EE204", "7376241EE206", "7376241EE207", "7376241EE209",
				"7376241EE210")
			r = append(r, expandRange("7376241EE212", "7376241EE216")...)
			return r
		}()},

		// S.No 70 - EW 215 - B.E. ME - 22ME001
		{HallNo: "EW 215", CourseCode: "22ME001", RegisterNos: expandRange("7376241ME110", "7376241ME124")},

		// S.No 71 - EW 218 - B.E. EE - 22EE007
		{HallNo: "EW 218", CourseCode: "22EE007", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EE503", "7376251EE514")...)
			r = append(r, "7376251EE516", "7376251EE517")
			return r
		}()},

		// S.No 72 - EW 218 - B.E. ME - 22ME001
		{HallNo: "EW 218", CourseCode: "22ME001", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241ME125", "7376241ME132")...)
			r = append(r, expandRange("7376241ME134", "7376241ME150")...)
			return r
		}()},

		// S.No 73 - EW 218 - B.Tech. AL - 22AM027
		{HallNo: "EW 218", CourseCode: "22AM027", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AL101", "7376242AL102")
			r = append(r, expandRange("7376242AL105", "7376242AL107")...)
			r = append(r, "7376242AL109")
			r = append(r, expandRange("7376242AL111", "7376242AL114")...)
			r = append(r, "7376242AL120")
			return r
		}()},

		// S.No 74 - MH 301 - B.E. CS - 22CS008
		{HallNo: "MH 301", CourseCode: "22CS008", RegisterNos: []string{
			"7376221CS275", "7376221CS288",
		}},

		// S.No 75 - MH 301 - B.Tech. IT - 22IT008
		{HallNo: "MH 301", CourseCode: "22IT008", RegisterNos: []string{"7376222IT110"}},

		// S.No 76 - MH 301 - B.E. CS - 22CS008
		{HallNo: "MH 301", CourseCode: "22CS008", RegisterNos: []string{
			"7376231CS102", "7376231CS103", "7376231CS139", "7376231CS173",
			"7376231CS190", "7376231CS235", "7376231CS244", "7376231CS259",
			"7376231CS292", "7376231CS346",
		}},

		// S.No 77 - MH 301 - B.Tech. IT - 22IT008
		{HallNo: "MH 301", CourseCode: "22IT008", RegisterNos: []string{
			"7376232IT113", "7376232IT118", "7376232IT146", "7376232IT152",
			"7376232IT224", "7376232IT274", "7376232IT282",
		}},

		// S.No 78 - MH 301 - B.E. CS - 22CS008
		{HallNo: "MH 301", CourseCode: "22CS008", RegisterNos: expandRange("7376241CS102", "7376241CS104")},

		// S.No 79 - MH 301 - B.Tech. IT - 22IT008
		{HallNo: "MH 301", CourseCode: "22IT008", RegisterNos: []string{
			"7376242IT102", "7376242IT103",
		}},

		// S.No 80 - MH 302 - B.E. CS - 22CS008
		{HallNo: "MH 302", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS105", "7376241CS107")...)
			r = append(r, expandRange("7376241CS109", "7376241CS120")...)
			return r
		}()},

		// S.No 81 - MH 302 - B.Tech. IT - 22IT008
		{HallNo: "MH 302", CourseCode: "22IT008", RegisterNos: expandRange("7376242IT104", "7376242IT113")},

		// S.No 82 - MH 303 - B.E. CS - 22CS008
		{HallNo: "MH 303", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS121", "7376241CS133")...)
			r = append(r, "7376241CS135", "7376241CS136")
			return r
		}()},

		// S.No 83 - MH 303 - B.Tech. IT - 22IT008
		{HallNo: "MH 303", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT114", "7376242IT116")...)
			r = append(r, expandRange("7376242IT118", "7376242IT121")...)
			r = append(r, "7376242IT124", "7376242IT126", "7376242IT127")
			return r
		}()},

		// S.No 84 - MH 305 - B.E. CS - 22CS008
		{HallNo: "MH 305", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS137", "7376241CS144")...)
			r = append(r, expandRange("7376241CS146", "7376241CS148")...)
			r = append(r, expandRange("7376241CS150", "7376241CS153")...)
			return r
		}()},

		// S.No 85 - MH 305 - B.Tech. IT - 22IT008
		{HallNo: "MH 305", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT128", "7376242IT135")...)
			r = append(r, "7376242IT137", "7376242IT138")
			return r
		}()},

		// S.No 86 - WW 005 - B.E. EC - 22EC040
		{HallNo: "WW 005", CourseCode: "22EC040", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC190", "7376241EC194")...)
			r = append(r, "7376241EC196")
			r = append(r, expandRange("7376241EC198", "7376241EC201")...)
			r = append(r, expandRange("7376241EC205", "7376241EC207")...)
			r = append(r, "7376241EC209", "7376241EC211")
			return r
		}()},

		// S.No 87 - WW 005 - B.Tech. AD - 22AI043
		{HallNo: "WW 005", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD122", "7376242AD123", "7376242AD125", "7376242AD126",
				"7376242AD133", "7376242AD136", "7376242AD137")
			r = append(r, expandRange("7376242AD140", "7376242AD142")...)
			return r
		}()},

		// S.No 88 - WW 006 - B.E. EC - 22EC040
		{HallNo: "WW 006", CourseCode: "22EC040", RegisterNos: []string{
			"7376241EC271", "7376241EC273", "7376241EC275", "7376241EC276",
			"7376241EC278", "7376241EC280", "7376241EC282", "7376241EC283",
			"7376241EC286", "7376241EC287", "7376241EC293", "7376241EC294",
			"7376241EC302", "7376241EC303", "7376241EC310",
		}},

		// S.No 89 - WW 006 - B.Tech. AD - 22AI043
		{HallNo: "WW 006", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD176", "7376242AD177", "7376242AD182", "7376242AD184")
			r = append(r, expandRange("7376242AD186", "7376242AD189")...)
			r = append(r, "7376242AD191", "7376242AD192")
			return r
		}()},

		// S.No 90 - WW 007 - B.E. EC - 22EC040
		{HallNo: "WW 007", CourseCode: "22EC040", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC311", "7376241EC317", "7376241EC318", "7376241EC321",
				"7376241EC322", "7376241EC324")
			r = append(r, expandRange("7376241EC332", "7376241EC338")...)
			r = append(r, "7376241EC340", "7376241EC342")
			return r
		}()},

		// S.No 91 - WW 007 - B.Tech. AD - 22AI043
		{HallNo: "WW 007", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD193", "7376242AD196", "7376242AD197", "7376242AD199")
			r = append(r, expandRange("7376242AD204", "7376242AD206")...)
			r = append(r, "7376242AD208", "7376242AD211", "7376242AD213")
			return r
		}()},

		// S.No 92 - WW 008 - B.E. EC - 22EC040
		{HallNo: "WW 008", CourseCode: "22EC040", RegisterNos: []string{"7376251EC521"}},

		// S.No 93 - WW 008 - B.Tech. BT - 22BT003
		{HallNo: "WW 008", CourseCode: "22BT003", RegisterNos: expandRange("7376242BT102", "7376242BT115")},

		// S.No 94 - WW 008 - B.Tech. AD - 22AI043
		{HallNo: "WW 008", CourseCode: "22AI043", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD243", "7376242AD245", "7376242AD247")
			r = append(r, expandRange("7376242AD249", "7376242AD251")...)
			r = append(r, "7376242AD253")
			r = append(r, expandRange("7376242AD255", "7376242AD257")...)
			return r
		}()},

		// S.No 95 - WW 011 - B.E. MZ - 22MC013
		{HallNo: "WW 011", CourseCode: "22MC013", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107", "7376231MZ111", "7376231MZ113",
			"7376231MZ119", "7376231MZ148",
		}},

		// S.No 96 - WW 011 - B.E. EE - 22EE007
		{HallNo: "WW 011", CourseCode: "22EE007", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE115", "7376241EE117")...)
			r = append(r, "7376241EE119", "7376241EE120")
			r = append(r, expandRange("7376241EE124", "7376241EE126")...)
			r = append(r, "7376241EE129", "7376241EE131")
			return r
		}()},

		// S.No 97 - WW 011 - B.Tech. BT - 22BT003
		{HallNo: "WW 011", CourseCode: "22BT003", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242BT211")
			r = append(r, expandRange("7376242BT213", "7376242BT217")...)
			r = append(r, "7376242BT221", "7376242BT222", "7376252BT501")
			return r
		}()},

		// S.No 98 - WW 012 - B.E. EE - 22EE007
		{HallNo: "WW 012", CourseCode: "22EE007", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EE146", "7376241EE149", "7376241EE151")
			r = append(r, expandRange("7376241EE154", "7376241EE157")...)
			r = append(r, "7376241EE159", "7376241EE161", "7376241EE162")
			return r
		}()},

		// S.No 99 - WW 012 - B.E. MZ - 22MC013
		{HallNo: "WW 012", CourseCode: "22MC013", RegisterNos: expandRange("7376241MZ116", "7376241MZ130")},

		// S.No 100 - WW 113 - B.E. CS - 22CS008
		{HallNo: "WW 113", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS210", "7376241CS212")...)
			r = append(r, expandRange("7376241CS214", "7376241CS217")...)
			r = append(r, expandRange("7376241CS219", "7376241CS226")...)
			return r
		}()},

		// S.No 101 - WW 113 - B.Tech. IT - 22IT008
		{HallNo: "WW 113", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242IT180", "7376242IT181")
			r = append(r, expandRange("7376242IT184", "7376242IT191")...)
			return r
		}()},

		// S.No 102 - WW 114 - B.E. CS - 22CS008
		{HallNo: "WW 114", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS245", "7376241CS252")...)
			r = append(r, "7376241CS254")
			r = append(r, expandRange("7376241CS256", "7376241CS261")...)
			return r
		}()},

		// S.No 103 - WW 114 - B.Tech. IT - 22IT008
		{HallNo: "WW 114", CourseCode: "22IT008", RegisterNos: expandRange("7376242IT202", "7376242IT211")},

		// S.No 104 - WW 115 - B.E. CS - 22CS008
		{HallNo: "WW 115", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS299", "7376241CS304")...)
			r = append(r, expandRange("7376241CS306", "7376241CS314")...)
			return r
		}()},

		// S.No 105 - WW 115 - B.Tech. IT - 22IT008
		{HallNo: "WW 115", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242IT236", "7376242IT238", "7376242IT241", "7376242IT243")
			r = append(r, expandRange("7376242IT246", "7376242IT251")...)
			return r
		}()},

		// S.No 106 - WW 117 - B.E. CS - 22CS008
		{HallNo: "WW 117", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241CS332", "7376241CS334", "7376241CS336", "7376241CS337")
			r = append(r, expandRange("7376241CS339", "7376241CS344")...)
			r = append(r, expandRange("7376241CS346", "7376241CS350")...)
			return r
		}()},

		// S.No 107 - WW 117 - B.Tech. IT - 22IT008
		{HallNo: "WW 117", CourseCode: "22IT008", RegisterNos: expandRange("7376242IT265", "7376242IT274")},

		// S.No 108 - WW 118 - B.E. CS - 22CS008
		{HallNo: "WW 118", CourseCode: "22CS008", RegisterNos: expandRange("7376241CS422", "7376241CS436")},

		// S.No 109 - WW 118 - B.Tech. IT - 22IT008
		{HallNo: "WW 118", CourseCode: "22IT008", RegisterNos: expandRange("7376242IT323", "7376242IT332")},

		// S.No 110 - WW 202 - 22IT008
		{HallNo: "WW 202", CourseCode: "22IT008", RegisterNos: []string{
			"7376242IT502", "7376242IT506", "7376242IT509",
		}},

		// S.No 111 - WW 202 - B.E. CS - 22CS008
		{HallNo: "WW 202", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS437", "7376241CS442")...)
			r = append(r, expandRange("7376241CS444", "7376241CS446")...)
			r = append(r, expandRange("7376241CS448", "7376241CS463")...)
			return r
		}()},

		// S.No 112 - WW 202 - B.Tech. IT - 22IT008
		{HallNo: "WW 202", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT333", "7376242IT343")...)
			r = append(r, expandRange("7376242IT345", "7376242IT350")...)
			r = append(r, expandRange("7376252IT501", "7376252IT505")...)
			return r
		}()},

		// S.No 113 - WW 203 - B.Tech. AD - 22AI002
		{HallNo: "WW 203", CourseCode: "22AI002", RegisterNos: []string{
			"7376232AD115", "7376232AD122", "7376232AD131",
		}},

		// S.No 114 - WW 203 - B.E. CS - 22CS008
		{HallNo: "WW 203", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241CS464", "7376241CS466", "7376241CS467", "7376241CS469",
				"7376241CS470")
			r = append(r, expandRange("7376241CS472", "7376241CS476")...)
			r = append(r, expandRange("7376251CS502", "7376251CS505")...)
			r = append(r, "7376251CS508")
			return r
		}()},

		// S.No 115 - WW 203 - B.Tech. IT - 22IT008
		{HallNo: "WW 203", CourseCode: "22IT008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376252IT506", "7376252IT507")
			r = append(r, expandRange("7376252IT509", "7376252IT511")...)
			r = append(r, "7376252IT514", "7376252IT515")
			return r
		}()},

		// S.No 116 - WW 204 - B.E. EC - 22EC001
		{HallNo: "WW 204", CourseCode: "22EC001", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC210", "7376241EC213")
			r = append(r, expandRange("7376241EC215", "7376241EC217")...)
			r = append(r, "7376241EC222")
			r = append(r, expandRange("7376241EC224", "7376241EC226")...)
			r = append(r, expandRange("7376241EC228", "7376241EC230")...)
			r = append(r, "7376241EC233", "7376241EC235", "7376241EC236")
			return r
		}()},

		// S.No 117 - WW 204 - B.Tech. AD - 22AI002
		{HallNo: "WW 204", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD178", "7376242AD181")...)
			r = append(r, "7376242AD183", "7376242AD185", "7376242AD190", "7376242AD194",
				"7376242AD195", "7376242AD198")
			return r
		}()},

		// S.No 118 - WW 205 - B.E. EC - 22EC001
		{HallNo: "WW 205", CourseCode: "22EC001", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC349", "7376241EC352")...)
			r = append(r, expandRange("7376251EC501", "7376251EC505")...)
			r = append(r, expandRange("7376251EC507", "7376251EC512")...)
			return r
		}()},

		// S.No 119 - WW 205 - B.Tech. AD - 22AI002
		{HallNo: "WW 205", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD282")
			r = append(r, expandRange("7376242AD285", "7376242AD287")...)
			r = append(r, "7376242AD289", "7376242AD295", "7376242AD296", "7376242AD303",
				"7376242AD304", "7376242AD307")
			return r
		}()},

		// S.No 120 - WW 211 - 22AI002
		{HallNo: "WW 211", CourseCode: "22AI002", RegisterNos: []string{"7376232AD502"}},

		// S.No 121 - WW 211 - B.E. EC - 22EC001
		{HallNo: "WW 211", CourseCode: "22EC001", RegisterNos: []string{
			"7376231EC110", "7376231EC305",
		}},

		// S.No 122 - WW 211 - B.Tech. AD - 22AI002
		{HallNo: "WW 211", CourseCode: "22AI002", RegisterNos: []string{
			"7376232AD136", "7376232AD174", "7376232AD184", "7376232AD250", "7376232AD282",
		}},

		// S.No 123 - WW 211 - B.E. CS - 22CS008
		{HallNo: "WW 211", CourseCode: "22CS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376251CS511")
			r = append(r, expandRange("7376251CS515", "7376251CS524")...)
			return r
		}()},

		// S.No 124 - WW 211 - B.E. EC - 22EC001
		{HallNo: "WW 211", CourseCode: "22EC001", RegisterNos: []string{
			"7376241EC104", "7376241EC110",
		}},

		// S.No 125 - WW 211 - B.Tech. AD - 22AI002
		{HallNo: "WW 211", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD103", "7376242AD105")...)
			r = append(r, "7376242AD107")
			return r
		}()},

		// S.No 126 - WW 212 - B.Tech. CT - 22CT008
		{HallNo: "WW 212", CourseCode: "22CT008", RegisterNos: []string{"7376232CT501"}},

		// S.No 127 - WW 212 - 22CT008
		{HallNo: "WW 212", CourseCode: "22CT008", RegisterNos: []string{
			"7376232CT122", "7376232CT127", "7376232CT139", "7376242CT503",
		}},

		// S.No 128 - WW 212 - B.Tech. AG - 22AG040
		{HallNo: "WW 212", CourseCode: "22AG040", RegisterNos: []string{"7376242AG502"}},

		// S.No 129 - WW 212 - B.Tech. BT - 22BT012
		{HallNo: "WW 212", CourseCode: "22BT012", RegisterNos: []string{
			"7376242BT116", "7376242BT119", "7376242BT120", "7376242BT136",
			"7376242BT138", "7376242BT150", "7376242BT151", "7376242BT162",
			"7376242BT169", "7376242BT174", "7376242BT179", "7376242BT190",
			"7376242BT194", "7376242BT205", "7376242BT212", "7376242BT218",
		}},

		// S.No 130 - WW 212 - B.Tech. AG - 22AG040
		{HallNo: "WW 212", CourseCode: "22AG040", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AG109", "7376242AG124")...)
			r = append(r, "7376252AG501", "7376252AG502")
			return r
		}()},

		// S.No 131 - WW 213 - B.E. EC - 22EC001
		{HallNo: "WW 213", CourseCode: "22EC001", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC320", "7376241EC323")
			r = append(r, expandRange("7376241EC325", "7376241EC331")...)
			r = append(r, "7376241EC339", "7376241EC341", "7376241EC343", "7376241EC344",
				"7376241EC347", "7376241EC348")
			return r
		}()},

		// S.No 132 - WW 213 - B.Tech. AD - 22AI002
		{HallNo: "WW 213", CourseCode: "22AI002", RegisterNos: []string{
			"7376242AD252", "7376242AD254", "7376242AD258", "7376242AD264",
			"7376242AD266", "7376242AD269", "7376242AD270", "7376242AD273",
			"7376242AD278", "7376242AD280",
		}},

		// S.No 133 - WW 214 - B.E. EC - 22EC040
		{HallNo: "WW 214", CourseCode: "22EC040", RegisterNos: []string{
			"7376231EC101", "7376231EC121", "7376231EC196", "7376231EC283",
			"7376231EC297", "7376231EC318", "7376231EC331", "7376231EC334",
		}},

		// S.No 134 - WW 214 - 22EC001
		{HallNo: "WW 214", CourseCode: "22EC001", RegisterNos: []string{
			"7376251EC513", "7376251EC514", "7376251EC516", "7376251EC519", "7376251EC520",
		}},

		// S.No 135 - WW 214 - 22EC040
		{HallNo: "WW 214", CourseCode: "22EC040", RegisterNos: []string{
			"7376241EC103", "7376241EC105",
		}},

		// S.No 136 - WW 214 - B.Tech. AD - 22AI002
		{HallNo: "WW 214", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD308")
			r = append(r, expandRange("7376242AD310", "7376242AD314")...)
			r = append(r, "7376242AD316", "7376242AD318", "7376242AD320", "7376242AD322")
			return r
		}()},

		// S.No 137 - WW 215 - B.E. EC - 22EC040
		{HallNo: "WW 215", CourseCode: "22EC040", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC106", "7376241EC109")...)
			r = append(r, "7376241EC112", "7376241EC113", "7376241EC116", "7376241EC117")
			r = append(r, expandRange("7376241EC126", "7376241EC130")...)
			r = append(r, "7376241EC132", "7376241EC135")
			return r
		}()},

		// S.No 138 - WW 215 - B.Tech. AD - 22AI002
		{HallNo: "WW 215", CourseCode: "22AI002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD324", "7376242AD325")
			r = append(r, expandRange("7376242AD329", "7376242AD335")...)
			r = append(r, "7376242AD338")
			return r
		}()},

		// S.No 139 - WW 218 - B.E. ME - 22ME001
		{HallNo: "WW 218", CourseCode: "22ME001", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241ME151", "7376241ME159")...)
			r = append(r, expandRange("7376251ME501", "7376251ME506")...)
			return r
		}()},

		// S.No 140 - WW 218 - B.Tech. AL - 22AM027
		{HallNo: "WW 218", CourseCode: "22AM027", RegisterNos: []string{
			"7376242AL126", "7376242AL127", "7376242AL129", "7376242AL131",
			"7376242AL132", "7376242AL137", "7376242AL139", "7376242AL144",
			"7376242AL145", "7376242AL147",
		}},

		// S.No 141 - WW 219 - B.E. EI - 22EI014
		{HallNo: "WW 219", CourseCode: "22EI014", RegisterNos: []string{
			"7376231EI128", "7376231EI159",
		}},

		// S.No 142 - WW 219 - 22EI014
		{HallNo: "WW 219", CourseCode: "22EI014", RegisterNos: expandRange("7376241EI101", "7376241EI111")},

		// S.No 143 - WW 219 - B.E. ME - 22ME001
		{HallNo: "WW 219", CourseCode: "22ME001", RegisterNos: []string{
			"7376251ME507", "7376251ME508",
		}},

		// S.No 144 - WW 219 - B.Tech. AL - 22AM027
		{HallNo: "WW 219", CourseCode: "22AM027", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AL148", "7376242AL150")...)
			r = append(r, expandRange("7376242AL152", "7376242AL158")...)
			return r
		}()},

		// S.No 145 - WW 222 - B.E. EI - 22EI014
		{HallNo: "WW 222", CourseCode: "22EI014", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI112", "7376241EI125")...)
			r = append(r, expandRange("7376241EI127", "7376241EI137")...)
			return r
		}()},

		// S.No 146 - WW 222 - B.Tech. AL - 22AM027
		{HallNo: "WW 222", CourseCode: "22AM027", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AL159", "7376242AL161")...)
			r = append(r, "7376242AL163", "7376242AL164", "7376242AL167", "7376242AL171",
				"7376242AL172", "7376242AL174")
			r = append(r, expandRange("7376242AL178", "7376242AL181")...)
			r = append(r, "7376242AL183", "7376242AL184", "7376242AL187", "7376242AL192")
			r = append(r, expandRange("7376242AL195", "7376242AL197")...)
			r = append(r, "7376242AL200")
			r = append(r, expandRange("7376242AL202", "7376242AL204")...)
			r = append(r, "7376242AL206")
			return r
		}()},

		// S.No 147 - WW 223 - B.Tech. CB - 22CB031
		{HallNo: "WW 223", CourseCode: "22CB031", RegisterNos: []string{
			"7376232CB106", "7376232CB123", "7376232CB133",
		}},

		// S.No 148 - WW 223 - B.Tech. AL - 22AM027
		{HallNo: "WW 223", CourseCode: "22AM027", RegisterNos: []string{"7376242AL501"}},

		// S.No 149 - WW 223 - B.E. EI - 22EI014
		{HallNo: "WW 223", CourseCode: "22EI014", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI138", "7376241EI160")...)
			r = append(r, "7376251EI501", "7376251EI502")
			return r
		}()},

		// S.No 150 - WW 223 - B.Tech. CB - 22CB031
		{HallNo: "WW 223", CourseCode: "22CB031", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB102", "7376242CB105")...)
			r = append(r, "7376242CB107", "7376242CB108")
			return r
		}()},

		// S.No 151 - WW 223 - B.Tech. AL - 22AM027
		{HallNo: "WW 223", CourseCode: "22AM027", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AL207", "7376242AL211")...)
			r = append(r, "7376242AL214", "7376242AL215")
			r = append(r, expandRange("7376242AL217", "7376242AL221")...)
			r = append(r, "7376242AL223", "7376252AL501", "7376252AL503")
			return r
		}()},

		// S.No 152 - WW 224 - B.E. EE - 22EE033
		{HallNo: "WW 224", CourseCode: "22EE033", RegisterNos: []string{
			"7376241EE102", "7376241EE104", "7376241EE106", "7376241EE107",
			"7376241EE110", "7376241EE118", "7376241EE121", "7376241EE122",
			"7376241EE123", "7376241EE127", "7376241EE128", "7376241EE130",
			"7376241EE132", "7376241EE135", "7376241EE136", "7376241EE145",
			"7376241EE147", "7376241EE148", "7376241EE150", "7376241EE152",
			"7376241EE153", "7376241EE158", "7376241EE160", "7376241EE167",
			"7376241EE170",
		}},

		// S.No 153 - WW 224 - B.Tech. CB - 22CB031
		{HallNo: "WW 224", CourseCode: "22CB031", RegisterNos: expandRange("7376242CB109", "7376242CB133")},

		// S.No 154 - WW 225 - B.E. CS - 22CS039
		{HallNo: "WW 225", CourseCode: "22CS039", RegisterNos: []string{
			"7376241CS108", "7376241CS203", "7376241CS213", "7376241CS232",
			"7376241CS253", "7376241CS255", "7376241CS262", "7376241CS273",
			"7376241CS281", "7376241CS286",
		}},

		// S.No 155 - WW 225 - B.E. EE - 22EE033
		{HallNo: "WW 225", CourseCode: "22EE033", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EE177", "7376241EE184")
			r = append(r, expandRange("7376241EE188", "7376241EE190")...)
			r = append(r, "7376241EE193", "7376241EE196", "7376241EE199", "7376241EE205",
				"7376241EE208", "7376241EE211", "7376241EE217", "7376251EE501",
				"7376251EE502", "7376251EE515")
			return r
		}()},

		// S.No 156 - WW 225 - B.Tech. CB - 22CB031
		{HallNo: "WW 225", CourseCode: "22CB031", RegisterNos: expandRange("7376242CB134", "7376242CB158")},

		// S.No 157 - WW 226 - B.E. CD - 22CD008
		{HallNo: "WW 226", CourseCode: "22CD008", RegisterNos: []string{
			"7376221CD114", "7376221CD144", "7376221CD153", "7376231CD503",
		}},

		// S.No 158 - WW 226 - 22CD008
		{HallNo: "WW 226", CourseCode: "22CD008", RegisterNos: []string{
			"7376231CD107", "7376231CD115", "7376231CD143", "7376241CD501", "7376241CD502",
		}},

		// S.No 159 - WW 226 - B.Tech. CB - 22CB031
		{HallNo: "WW 226", CourseCode: "22CB031", RegisterNos: []string{"7376242CB502"}},

		// S.No 160 - WW 226 - B.E. CS - 22CS039
		{HallNo: "WW 226", CourseCode: "22CS039", RegisterNos: []string{
			"7376241CS289", "7376241CS305", "7376241CS333", "7376241CS338",
			"7376241CS351", "7376241CS361", "7376241CS369", "7376241CS389",
			"7376241CS394", "7376241CS396", "7376241CS400", "7376241CS403",
			"7376241CS447", "7376251CS506", "7376251CS507", "7376251CS513",
		}},

		// S.No 161 - WW 226 - B.Tech. CB - 22CB031
		{HallNo: "WW 226", CourseCode: "22CB031", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242CB159")
			r = append(r, expandRange("7376252CB501", "7376252CB503")...)
			return r
		}()},

		// S.No 162 - WW 226 - B.Tech. AL - 22AM002
		{HallNo: "WW 226", CourseCode: "22AM002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AL103", "7376242AL104", "7376242AL108", "7376242AL110")
			r = append(r, expandRange("7376242AL115", "7376242AL119")...)
			r = append(r, expandRange("7376242AL121", "7376242AL125")...)
			r = append(r, "7376242AL128", "7376242AL130")
			r = append(r, expandRange("7376242AL133", "7376242AL136")...)
			return r
		}()},

		// S.No 163 - WW 227 - B.Tech. AG - 22AG040
		{HallNo: "WW 227", CourseCode: "22AG040", RegisterNos: []string{"7376222AG158"}},

		// S.No 164 - WW 227 - B.E. SE - 22IS020
		{HallNo: "WW 227", CourseCode: "22IS020", RegisterNos: []string{
			"7376231SE128", "7376231SE137", "7376231SE153",
		}},

		// S.No 165 - WW 227 - B.Tech. AG - 22AG040
		{HallNo: "WW 227", CourseCode: "22AG040", RegisterNos: []string{
			"7376232AG113", "7376232AG129", "7376232AG151",
		}},

		// S.No 166 - WW 227 - B.Tech. AL - 22AM002
		{HallNo: "WW 227", CourseCode: "22AM002", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AL138")
			r = append(r, expandRange("7376242AL140", "7376242AL143")...)
			r = append(r, "7376242AL146", "7376242AL151", "7376242AL162", "7376242AL165",
				"7376242AL166")
			r = append(r, expandRange("7376242AL168", "7376242AL170")...)
			r = append(r, "7376242AL173")
			r = append(r, expandRange("7376242AL175", "7376242AL177")...)
			r = append(r, "7376242AL182", "7376242AL185", "7376242AL186")
			r = append(r, expandRange("7376242AL188", "7376242AL191")...)
			r = append(r, "7376242AL193", "7376242AL194", "7376242AL198", "7376242AL199",
				"7376242AL201", "7376242AL205", "7376242AL212", "7376242AL213",
				"7376242AL216", "7376242AL222", "7376252AL502")
			return r
		}()},

		// S.No 167 - WW 227 - B.Tech. AG - 22AG040
		{HallNo: "WW 227", CourseCode: "22AG040", RegisterNos: expandRange("7376242AG101", "7376242AG108")},
	}
}

func buildSeatingData08AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. CS - 22CS701
		{HallNo: "EW 101", CourseCode: "22CS701", RegisterNos: []string{
			"7376221CS109", "7376221CS111", "7376221CS118", "7376221CS196",
			"7376221CS275", "7376221CS288", "7376221CS322",
		}},

		// S.No 2 - EW 101 - B.E. EC - 22EC701
		{HallNo: "EW 101", CourseCode: "22EC701", RegisterNos: []string{
			"7376221EC102", "7376221EC107", "7376221EC127", "7376221EC131",
			"7376221EC192", "7376221EC226", "7376221EC288", "7376221EC290",
			"7376221EC337",
		}},

		// S.No 3 - EW 101 - B.E. ME - 22ME701
		{HallNo: "EW 101", CourseCode: "22ME701", RegisterNos: []string{
			"7376221ME114", "7376221ME116", "7376221ME138",
		}},

		// S.No 4 - EW 101 - B.E. CD - 22CD701
		{HallNo: "EW 101", CourseCode: "22CD701", RegisterNos: []string{
			"7376221CD114", "7376221CD126", "7376221CD144", "7376221CD153",
			"7376231CD503",
		}},

		// S.No 5 - EW 101 - B.Tech. AL - 22AM701
		{HallNo: "EW 101", CourseCode: "22AM701", RegisterNos: []string{"7376222AL162"}},

		// S.No 6 - EW 102 - B.E. CE - 22CE701
		{HallNo: "EW 102", CourseCode: "22CE701", RegisterNos: []string{"7376221CE124"}},

		// S.No 7 - EW 102 - B.E. EE - 22EE701
		{HallNo: "EW 102", CourseCode: "22EE701", RegisterNos: []string{"7376221EE124"}},

		// S.No 8 - EW 102 - B.E. ME - 22ME701
		{HallNo: "EW 102", CourseCode: "22ME701", RegisterNos: []string{"7376221ME154"}},

		// S.No 9 - EW 102 - B.E. MC - 22MC701
		{HallNo: "EW 102", CourseCode: "22MC701", RegisterNos: []string{"7376231MC506"}},

		// S.No 10 - EW 102 - B.E. BM - 22BM701
		{HallNo: "EW 102", CourseCode: "22BM701", RegisterNos: []string{"7376231BM502"}},

		// S.No 11 - EW 102 - B.Tech. FT - 22FT701
		{HallNo: "EW 102", CourseCode: "22FT701", RegisterNos: []string{"7376232FT501"}},

		// S.No 12 - EW 102 - B.Tech. IT - 22IT701
		{HallNo: "EW 102", CourseCode: "22IT701", RegisterNos: []string{
			"7376222IT110", "7376222IT235",
		}},

		// S.No 13 - EW 102 - B.Tech. AL - 22AM701
		{HallNo: "EW 102", CourseCode: "22AM701", RegisterNos: []string{
			"7376222AL169", "7376232AL507",
		}},

		// S.No 14 - EW 102 - B.Tech. AG - 22AG701
		{HallNo: "EW 102", CourseCode: "22AG701", RegisterNos: []string{
			"7376222AG120", "7376222AG158",
		}},

		// S.No 15 - EW 102 - B.E. CS - 22HS005
		{HallNo: "EW 102", CourseCode: "22HS005", RegisterNos: []string{"7376231CS190"}},

		// S.No 16 - EW 102 - B.E. EC - 22HS005
		{HallNo: "EW 102", CourseCode: "22HS005", RegisterNos: []string{
			"7376231EC331", "7376231EC334",
		}},

		// S.No 17 - EW 102 - B.E. SE - 22HS005
		{HallNo: "EW 102", CourseCode: "22HS005", RegisterNos: []string{
			"7376231SE144", "7376231SE153",
		}},

		// S.No 18 - EW 102 - B.E. CD - 22HS005
		{HallNo: "EW 102", CourseCode: "22HS005", RegisterNos: []string{"7376241CD501"}},

		// S.No 19 - EW 102 - B.Tech. IT - 22HS005
		{HallNo: "EW 102", CourseCode: "22HS005", RegisterNos: []string{"7376232IT282"}},

		// S.No 20 - EW 102 - B.E. CS - 22HS005
		{HallNo: "EW 102", CourseCode: "22HS005", RegisterNos: []string{"7376241CS332"}},

		// S.No 21 - EW 102 - B.E. EC - 22HS005
		{HallNo: "EW 102", CourseCode: "22HS005", RegisterNos: []string{"7376241EC348"}},

		// S.No 22 - EW 102 - B.E. EE - 22HS005
		{HallNo: "EW 102", CourseCode: "22HS005", RegisterNos: []string{"7376241EE147"}},

		// S.No 23 - EW 102 - B.Tech. IT - 22HS005
		{HallNo: "EW 102", CourseCode: "22HS005", RegisterNos: []string{
			"7376242IT184", "7376252IT511",
		}},

		// S.No 24 - EW 102 - B.Tech. AD - 22HS005
		{HallNo: "EW 102", CourseCode: "22HS005", RegisterNos: []string{"7376252AD515"}},

		// S.No 25 - EW 103 - B.E. SE - 22IS701
		{HallNo: "EW 103", CourseCode: "22IS701", RegisterNos: []string{"7376221SE134"}},

		// S.No 26 - EW 103 - B.E. CE - 22HS005
		{HallNo: "EW 103", CourseCode: "22HS005", RegisterNos: []string{"7376231CE126"}},

		// S.No 27 - EW 103 - B.E. EI - 22HS005
		{HallNo: "EW 103", CourseCode: "22HS005", RegisterNos: []string{"7376231EI128"}},

		// S.No 28 - EW 103 - B.Tech. BT - 22HS005
		{HallNo: "EW 103", CourseCode: "22HS005", RegisterNos: []string{"7376252BT501"}},
	}
}

func buildSeatingData09FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. EC - 22OCS01
		{HallNo: "EW 101", CourseCode: "22OCS01", RegisterNos: []string{"7376221EC192"}},

		// S.No 2 - EW 101 - B.Tech. AL - 22AM034
		{HallNo: "EW 101", CourseCode: "22AM034", RegisterNos: []string{"7376222AL169"}},

		// S.No 3 - EW 101 - B.E. EC - 22OCS01
		{HallNo: "EW 101", CourseCode: "22OCS01", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC102", "7376231EC106", "7376231EC116", "7376231EC118")
			r = append(r, expandRange("7376231EC128", "7376231EC130")...)
			r = append(r, expandRange("7376231EC133", "7376231EC135")...)
			r = append(r, "7376231EC137", "7376231EC139", "7376231EC140", "7376231EC144")
			return r
		}()},

		// S.No 4 - EW 101 - B.Tech. AL - 22AM034
		{HallNo: "EW 101", CourseCode: "22AM034", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL101", "7376232AL104")...)
			r = append(r, "7376232AL106", "7376232AL107", "7376232AL110", "7376232AL113", "7376232AL114")
			return r
		}()},

		// S.No 5 - EW 102 - B.E. EC - 22OCS01
		{HallNo: "EW 102", CourseCode: "22OCS01", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC149", "7376231EC158", "7376231EC162", "7376231EC168",
				"7376231EC169", "7376231EC173", "7376231EC174", "7376231EC179",
				"7376231EC184", "7376231EC188", "7376231EC193")
			r = append(r, expandRange("7376231EC195", "7376231EC197")...)
			r = append(r, "7376231EC200")
			return r
		}()},

		// S.No 6 - EW 102 - B.Tech. AL - 22AM034
		{HallNo: "EW 102", CourseCode: "22AM034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AL116", "7376232AL117", "7376232AL119", "7376232AL120",
				"7376232AL123")
			r = append(r, expandRange("7376232AL125", "7376232AL129")...)
			return r
		}()},

		// S.No 7 - EW 103 - B.E. EC - 22OCS01
		{HallNo: "EW 103", CourseCode: "22OCS01", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC329")
			r = append(r, expandRange("7376231EC331", "7376231EC334")...)
			r = append(r, expandRange("7376241EC501", "7376241EC503")...)
			r = append(r, expandRange("7376241EC505", "7376241EC508")...)
			r = append(r, "7376241EC510", "7376241EC511", "7376241EC513")
			return r
		}()},

		// S.No 8 - EW 103 - B.Tech. AL - 22AM034
		{HallNo: "EW 103", CourseCode: "22AM034", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL169", "7376232AL173")...)
			r = append(r, expandRange("7376232AL177", "7376232AL181")...)
			return r
		}()},

		// S.No 9 - EW 104 - B.Tech. BT - 22BT010
		{HallNo: "EW 104", CourseCode: "22BT010", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT184", "7376232BT185")
			r = append(r, expandRange("7376232BT187", "7376232BT198")...)
			r = append(r, "7376232BT201")
			return r
		}()},

		// S.No 10 - EW 104 - B.Tech. AD - 22AI035
		{HallNo: "EW 104", CourseCode: "22AI035", RegisterNos: []string{
			"7376232AD144", "7376232AD151", "7376232AD157", "7376232AD159",
			"7376232AD160", "7376232AD162", "7376232AD168", "7376232AD173",
			"7376232AD177", "7376232AD179",
		}},

		// S.No 11 - EW 105 - B.E. EC - 22OBM01
		{HallNo: "EW 105", CourseCode: "22OBM01", RegisterNos: []string{
			"7376231EC103", "7376231EC104", "7376231EC107", "7376231EC108",
		}},

		// S.No 12 - EW 105 - B.Tech. BT - 22BT010
		{HallNo: "EW 105", CourseCode: "22BT010", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT203")
			r = append(r, expandRange("7376232BT205", "7376232BT207")...)
			r = append(r, expandRange("7376232BT209", "7376232BT215")...)
			return r
		}()},

		// S.No 13 - EW 105 - B.Tech. AD - 22AI035
		{HallNo: "EW 105", CourseCode: "22AI035", RegisterNos: []string{
			"7376232AD188", "7376232AD197", "7376232AD199", "7376232AD200",
			"7376232AD203", "7376232AD204", "7376232AD209", "7376232AD211",
			"7376232AD227", "7376232AD229",
		}},

		// S.No 14 - EW 106 - B.E. EC - 22OBM01
		{HallNo: "EW 106", CourseCode: "22OBM01", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC295")
			r = append(r, expandRange("7376231EC302", "7376231EC304")...)
			r = append(r, expandRange("7376231EC311", "7376231EC314")...)
			r = append(r, "7376231EC317", "7376231EC322", "7376231EC328",
				"7376241EC504", "7376241EC512")
			return r
		}()},

		// S.No 15 - EW 106 - 22OME04
		{HallNo: "EW 106", CourseCode: "22OME04", RegisterNos: []string{
			"7376231EC101", "7376231EC105",
		}},

		// S.No 16 - EW 106 - B.Tech. FD - 22FD009
		{HallNo: "EW 106", CourseCode: "22FD009", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232FD102", "7376232FD103")
			r = append(r, expandRange("7376232FD105", "7376232FD112")...)
			return r
		}()},

		// S.No 17 - EW 107 - B.E. EC - 22OCS01
		{HallNo: "EW 107", CourseCode: "22OCS01", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC243", "7376231EC244", "7376231EC246")
			r = append(r, expandRange("7376231EC250", "7376231EC254")...)
			r = append(r, "7376231EC260", "7376231EC263", "7376231EC264", "7376231EC267",
				"7376231EC270", "7376231EC273", "7376231EC276")
			return r
		}()},

		// S.No 18 - EW 107 - B.Tech. AL - 22AM034
		{HallNo: "EW 107", CourseCode: "22AM034", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL146", "7376232AL149")...)
			r = append(r, expandRange("7376232AL151", "7376232AL156")...)
			return r
		}()},

		// S.No 19 - EW 108 - B.Tech. BT - 22BT010
		{HallNo: "EW 108", CourseCode: "22BT010", RegisterNos: []string{
			"7376222BT110", "7376222BT152", "7376222BT193",
		}},

		// S.No 20 - EW 108 - B.E. EC - 22OCS01
		{HallNo: "EW 108", CourseCode: "22OCS01", RegisterNos: expandRange("7376241EC514", "7376241EC522")},

		// S.No 21 - EW 108 - B.Tech. BT - 22BT010
		{HallNo: "EW 108", CourseCode: "22BT010", RegisterNos: []string{
			"7376232BT102", "7376232BT104", "7376232BT106",
		}},

		// S.No 22 - EW 108 - B.Tech. AL - 22AM034
		{HallNo: "EW 108", CourseCode: "22AM034", RegisterNos: []string{
			"7376232AL183", "7376232AL184", "7376232AL186", "7376232AL187",
			"7376232AL189", "7376232AL190", "7376232AL192", "7376232AL193",
			"7376232AL195", "7376232AL198",
		}},

		// S.No 23 - EW 109 - B.Tech. BT - 22BT010
		{HallNo: "EW 109", CourseCode: "22BT010", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT122", "7376232BT123")
			r = append(r, expandRange("7376232BT125", "7376232BT127")...)
			r = append(r, "7376232BT129", "7376232BT130", "7376232BT132", "7376232BT133")
			r = append(r, expandRange("7376232BT135", "7376232BT137")...)
			r = append(r, expandRange("7376232BT139", "7376232BT141")...)
			return r
		}()},

		// S.No 24 - EW 109 - B.Tech. AL - 22AM034
		{HallNo: "EW 109", CourseCode: "22AM034", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL215", "7376232AL217")...)
			r = append(r, "7376232AL220", "7376232AL221")
			r = append(r, expandRange("7376242AL501", "7376242AL505")...)
			return r
		}()},

		// S.No 25 - EW 111 - B.Tech. BT - 22BT010
		{HallNo: "EW 111", CourseCode: "22BT010", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT164", "7376232BT166", "7376232BT167")
			r = append(r, expandRange("7376232BT169", "7376232BT172")...)
			r = append(r, "7376232BT174", "7376232BT175")
			r = append(r, expandRange("7376232BT178", "7376232BT183")...)
			return r
		}()},

		// S.No 26 - EW 111 - B.Tech. AD - 22AI035
		{HallNo: "EW 111", CourseCode: "22AI035", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD120", "7376232AD122")
			r = append(r, expandRange("7376232AD127", "7376232AD129")...)
			r = append(r, "7376232AD131", "7376232AD132")
			r = append(r, expandRange("7376232AD141", "7376232AD143")...)
			return r
		}()},

		// S.No 27 - EW 112 - B.E. EC - 22OBM01
		{HallNo: "EW 112", CourseCode: "22OBM01", RegisterNos: []string{
			"7376231EC111", "7376231EC112", "7376231EC126", "7376231EC131",
			"7376231EC132", "7376231EC138", "7376231EC142", "7376231EC153",
			"7376231EC159", "7376231EC160", "7376231EC163", "7376231EC164",
			"7376231EC167", "7376231EC175", "7376231EC178",
		}},

		// S.No 28 - EW 112 - B.Tech. AD - 22AI035
		{HallNo: "EW 112", CourseCode: "22AI035", RegisterNos: []string{
			"7376232AD230", "7376232AD231", "7376232AD238", "7376232AD240",
			"7376232AD246", "7376232AD250", "7376232AD251", "7376232AD255",
			"7376232AD257", "7376232AD265",
		}},

		// S.No 29 - EW 113 - B.E. CS - 22CS040
		{HallNo: "EW 113", CourseCode: "22CS040", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS138", "7376231CS140", "7376231CS144", "7376231CS148",
				"7376231CS162", "7376231CS171", "7376231CS188", "7376231CS192",
				"7376231CS197")
			r = append(r, expandRange("7376231CS199", "7376231CS202")...)
			r = append(r, "7376231CS219", "7376231CS221")
			return r
		}()},

		// S.No 30 - EW 113 - B.E. EI - 22EI018
		{HallNo: "EW 113", CourseCode: "22EI018", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EI154", "7376231EI159")...)
			r = append(r, expandRange("7376241EI501", "7376241EI504")...)
			return r
		}()},

		// S.No 31 - EW 114 - B.Tech. AG - 22AG017
		{HallNo: "EW 114", CourseCode: "22AG017", RegisterNos: []string{"7376232AG502"}},

		// S.No 32 - EW 114 - B.E. ME - 22ME021
		{HallNo: "EW 114", CourseCode: "22ME021", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231ME104", "7376231ME106")...)
			r = append(r, "7376231ME109", "7376231ME110")
			return r
		}()},

		// S.No 33 - EW 114 - B.Tech. CT - 22CT040
		{HallNo: "EW 114", CourseCode: "22CT040", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CT108", "7376232CT110", "7376232CT112", "7376232CT114",
				"7376232CT118", "7376232CT124")
			r = append(r, expandRange("7376232CT126", "7376232CT128")...)
			r = append(r, "7376232CT131", "7376232CT134", "7376232CT137", "7376232CT141",
				"7376232CT143", "7376232CT146")
			return r
		}()},

		// S.No 34 - EW 114 - B.Tech. AG - 22AG017
		{HallNo: "EW 114", CourseCode: "22AG017", RegisterNos: expandRange("7376242AG501", "7376242AG504")},

		// S.No 35 - EW 115 - B.Tech. CB - 22CB028
		{HallNo: "EW 115", CourseCode: "22CB028", RegisterNos: []string{"7376222CB121"}},

		// S.No 36 - EW 115 - B.E. CE - 22CE026
		{HallNo: "EW 115", CourseCode: "22CE026", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CE115", "7376231CE120")...)
			r = append(r, expandRange("7376231CE122", "7376231CE127")...)
			r = append(r, "7376231CE129", "7376241CE501", "7376241CE502")
			return r
		}()},

		// S.No 37 - EW 115 - B.E. ME - 22ME021
		{HallNo: "EW 115", CourseCode: "22ME021", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231ME155", "7376231ME158")...)
			r = append(r, "7376231ME161", "7376241ME501", "7376241ME505")
			return r
		}()},

		// S.No 38 - EW 115 - B.Tech. CB - 22CB028
		{HallNo: "EW 115", CourseCode: "22CB028", RegisterNos: []string{
			"7376232CB102", "7376232CB103",
		}},

		// S.No 39 - EW 116 - B.E. CE - 22CE026
		{HallNo: "EW 116", CourseCode: "22CE026", RegisterNos: []string{
			"7376241CE503", "7376241CE504",
		}},

		// S.No 40 - EW 116 - B.Tech. CB - 22CB028
		{HallNo: "EW 116", CourseCode: "22CB028", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB104", "7376232CB106")...)
			r = append(r, "7376232CB111", "7376232CB114")
			r = append(r, expandRange("7376232CB119", "7376232CB121")...)
			r = append(r, "7376232CB125", "7376232CB126")
			return r
		}()},

		// S.No 41 - EW 116 - B.Tech. AD - 22OCE02
		{HallNo: "EW 116", CourseCode: "22OCE02", RegisterNos: []string{
			"7376232AD102", "7376232AD104", "7376232AD105", "7376232AD111",
			"7376232AD126", "7376232AD140", "7376232AD154", "7376232AD155",
			"7376232AD163", "7376232AD164", "7376232AD178", "7376232AD180",
			"7376232AD181",
		}},

		// S.No 42 - EW 117 - B.Tech. CB - 22CB028
		{HallNo: "EW 117", CourseCode: "22CB028", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB149", "7376232CB157")...)
			r = append(r, "7376232CB159")
			return r
		}()},

		// S.No 43 - EW 117 - B.Tech. AD - 22OCE02
		{HallNo: "EW 117", CourseCode: "22OCE02", RegisterNos: []string{"7376232AD253"}},

		// S.No 44 - EW 117 - 22OME04
		{HallNo: "EW 117", CourseCode: "22OME04", RegisterNos: []string{
			"7376232AD106", "7376232AD108", "7376232AD109", "7376232AD113",
			"7376232AD130", "7376232AD135", "7376232AD147", "7376232AD149",
			"7376232AD165", "7376232AD166", "7376232AD183", "7376232AD184",
			"7376232AD190", "7376232AD191",
		}},

		// S.No 45 - EW 118 - B.E. CS - 22OME04
		{HallNo: "EW 118", CourseCode: "22OME04", RegisterNos: []string{
			"7376231CS153", "7376231CS164", "7376231CS175", "7376231CS186",
			"7376231CS189", "7376231CS204", "7376231CS207", "7376231CS212",
			"7376231CS216", "7376231CS241", "7376231CS270", "7376231CS273",
			"7376231CS286", "7376231CS289", "7376231CS299",
		}},

		// S.No 46 - EW 118 - B.E. SE - 22IS006
		{HallNo: "EW 118", CourseCode: "22IS006", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE112", "7376231SE114")...)
			r = append(r, expandRange("7376231SE116", "7376231SE119")...)
			r = append(r, expandRange("7376231SE121", "7376231SE123")...)
			return r
		}()},

		// S.No 47 - EW 201 - B.E. EC - 22OME04
		{HallNo: "EW 201", CourseCode: "22OME04", RegisterNos: []string{
			"7376231EC147", "7376231EC148", "7376231EC150", "7376231EC155",
			"7376231EC166", "7376231EC172", "7376231EC176", "7376231EC191",
			"7376231EC192", "7376231EC194", "7376231EC203", "7376231EC207",
			"7376231EC209", "7376231EC212", "7376231EC222",
		}},

		// S.No 48 - EW 201 - B.Tech. FD - 22FD009
		{HallNo: "EW 201", CourseCode: "22FD009", RegisterNos: expandRange("7376232FD124", "7376232FD133")},

		// S.No 49 - EW 202 - B.Tech. IT - 22OBM01
		{HallNo: "EW 202", CourseCode: "22OBM01", RegisterNos: []string{"7376212IT105"}},

		// S.No 50 - EW 202 - B.E. EC - 22OME04
		{HallNo: "EW 202", CourseCode: "22OME04", RegisterNos: []string{
			"7376231EC318", "7376231EC321", "7376231EC330",
		}},

		// S.No 51 - EW 202 - B.E. EI - 22EI018
		{HallNo: "EW 202", CourseCode: "22EI018", RegisterNos: []string{"7376231EI102"}},

		// S.No 52 - EW 202 - B.Tech. FD - 22FD009
		{HallNo: "EW 202", CourseCode: "22FD009", RegisterNos: expandRange("7376232FD144", "7376232FD152")},

		// S.No 53 - EW 202 - B.Tech. IT - 22OBM01
		{HallNo: "EW 202", CourseCode: "22OBM01", RegisterNos: []string{
			"7376232IT109", "7376232IT112", "7376232IT115", "7376232IT120",
			"7376232IT121", "7376232IT126", "7376232IT134", "7376232IT149",
			"7376232IT160", "7376232IT172", "7376232IT177",
		}},

		// S.No 54 - EW 203 - B.Tech. AG - 22AG017
		{HallNo: "EW 203", CourseCode: "22AG017", RegisterNos: []string{
			"7376222AG116", "7376222AG120", "7376222AG147", "7376222AG158",
		}},

		// S.No 55 - EW 203 - B.E. CS - 22CS040
		{HallNo: "EW 203", CourseCode: "22CS040", RegisterNos: []string{
			"7376231CS223", "7376231CS229", "7376231CS232", "7376231CS233",
			"7376231CS236", "7376231CS256", "7376231CS259", "7376231CS261",
			"7376231CS268", "7376231CS275", "7376231CS292", "7376231CS298",
			"7376231CS302", "7376231CS312", "7376231CS320",
		}},

		// S.No 56 - EW 203 - B.Tech. AG - 22AG017
		{HallNo: "EW 203", CourseCode: "22AG017", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG102", "7376232AG104")...)
			r = append(r, expandRange("7376232AG107", "7376232AG109")...)
			return r
		}()},

		// S.No 57 - EW 206 - B.E. CE - 22CE026
		{HallNo: "EW 206", CourseCode: "22CE026", RegisterNos: []string{"7376221CE124"}},

		// S.No 58 - EW 206 - B.Tech. CT - 22CT040
		{HallNo: "EW 206", CourseCode: "22CT040", RegisterNos: []string{"7376232CT501"}},

		// S.No 59 - EW 206 - B.E. CE - 22CE026
		{HallNo: "EW 206", CourseCode: "22CE026", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CE101")
			r = append(r, expandRange("7376231CE103", "7376231CE110")...)
			r = append(r, expandRange("7376231CE112", "7376231CE114")...)
			return r
		}()},

		// S.No 60 - EW 206 - B.E. ME - 22ME021
		{HallNo: "EW 206", CourseCode: "22ME021", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231ME111", "7376231ME113")...)
			r = append(r, "7376231ME116", "7376231ME117")
			r = append(r, expandRange("7376231ME125", "7376231ME128")...)
			r = append(r, "7376231ME130", "7376231ME132", "7376231ME133", "7376231ME137",
				"7376231ME138", "7376231ME140", "7376231ME142")
			r = append(r, expandRange("7376231ME144", "7376231ME146")...)
			r = append(r, "7376231ME148", "7376231ME149")
			r = append(r, expandRange("7376231ME151", "7376231ME154")...)
			return r
		}()},

		// S.No 61 - EW 206 - B.Tech. CT - 22CT040
		{HallNo: "EW 206", CourseCode: "22CT040", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CT148")
			r = append(r, expandRange("7376232CT151", "7376232CT155")...)
			r = append(r, "7376232CT157", "7376232CT158", "7376232CT160", "7376232CT161",
				"7376242CT503")
			return r
		}()},

		// S.No 62 - EW 207 - B.Tech. FD - 22FD009
		{HallNo: "EW 207", CourseCode: "22FD009", RegisterNos: []string{
			"7376222FD107", "7376222FD116", "7376222FD125",
		}},

		// S.No 63 - EW 207 - B.Tech. AD - 22AI035
		{HallNo: "EW 207", CourseCode: "22AI035", RegisterNos: []string{"7376232AD502"}},

		// S.No 64 - EW 207 - B.E. EC - 22OBM01
		{HallNo: "EW 207", CourseCode: "22OBM01", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC256", "7376231EC258")...)
			r = append(r, "7376231EC261", "7376231EC262", "7376231EC265", "7376231EC268",
				"7376231EC269", "7376231EC271", "7376231EC272", "7376231EC279",
				"7376231EC281", "7376231EC282", "7376231EC285", "7376231EC289")
			return r
		}()},

		// S.No 65 - EW 207 - B.Tech. FD - 22FD009
		{HallNo: "EW 207", CourseCode: "22FD009", RegisterNos: []string{"7376232FD101"}},

		// S.No 66 - EW 207 - B.Tech. AD - 22AI035
		{HallNo: "EW 207", CourseCode: "22AI035", RegisterNos: []string{
			"7376232AD281", "7376232AD283",
			"7376242AD501", "7376242AD504", "7376242AD509",
		}},

		// S.No 67 - EW 208 - B.E. EC - 22OME04
		{HallNo: "EW 208", CourseCode: "22OME04", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC110", "7376231EC113", "7376231EC115", "7376231EC117")
			r = append(r, expandRange("7376231EC119", "7376231EC125")...)
			r = append(r, "7376231EC136", "7376231EC143", "7376231EC145", "7376231EC146")
			return r
		}()},

		// S.No 68 - EW 208 - B.Tech. FD - 22FD009
		{HallNo: "EW 208", CourseCode: "22FD009", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FD113", "7376232FD120")...)
			r = append(r, "7376232FD122", "7376232FD123")
			return r
		}()},

		// S.No 69 - EW 209 - B.E. EC - 22OME04
		{HallNo: "EW 209", CourseCode: "22OME04", RegisterNos: []string{
			"7376231EC224", "7376231EC225", "7376231EC228", "7376231EC235",
			"7376231EC240", "7376231EC245", "7376231EC266", "7376231EC280",
			"7376231EC283", "7376231EC291", "7376231EC293", "7376231EC296",
			"7376231EC299", "7376231EC306", "7376231EC310",
		}},

		// S.No 70 - EW 209 - B.Tech. FD - 22FD009
		{HallNo: "EW 209", CourseCode: "22FD009", RegisterNos: expandRange("7376232FD134", "7376232FD143")},

		// S.No 71 - EW 212 - B.E. EI - 22EI018
		{HallNo: "EW 212", CourseCode: "22EI018", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EI103", "7376231EI105")...)
			r = append(r, expandRange("7376231EI108", "7376231EI110")...)
			r = append(r, expandRange("7376231EI114", "7376231EI118")...)
			r = append(r, expandRange("7376231EI120", "7376231EI125")...)
			r = append(r, expandRange("7376231EI127", "7376231EI133")...)
			r = append(r, "7376231EI135")
			return r
		}()},

		// S.No 72 - EW 212 - B.Tech. IT - 22OBM01
		{HallNo: "EW 212", CourseCode: "22OBM01", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT179", "7376232IT187", "7376232IT188", "7376232IT195",
				"7376232IT199", "7376232IT201", "7376232IT208", "7376232IT212",
				"7376232IT214", "7376232IT215", "7376232IT222", "7376232IT229",
				"7376232IT240", "7376232IT241")
			r = append(r, expandRange("7376232IT244", "7376232IT246")...)
			return r
		}()},

		// S.No 73 - EW 213 - B.E. CS - 22OME04
		{HallNo: "EW 213", CourseCode: "22OME04", RegisterNos: []string{
			"7376231CS308", "7376231CS309", "7376231CS311", "7376231CS316",
			"7376241CS504", "7376241CS507", "7376241CS519",
		}},

		// S.No 74 - EW 213 - B.E. SE - 22IS006
		{HallNo: "EW 213", CourseCode: "22IS006", RegisterNos: []string{
			"7376231SE124", "7376231SE128", "7376231SE129", "7376231SE134",
			"7376231SE136", "7376231SE139", "7376231SE141", "7376231SE143",
			"7376231SE145", "7376231SE146",
		}},

		// S.No 75 - EW 213 - B.E. CD - 22OBM01
		{HallNo: "EW 213", CourseCode: "22OBM01", RegisterNos: []string{
			"7376231CD103", "7376231CD104", "7376231CD109", "7376231CD110",
			"7376231CD115", "7376231CD122", "7376231CD123", "7376231CD130",
		}},

		// S.No 76 - EW 214 - B.E. ME - 22ME028
		{HallNo: "EW 214", CourseCode: "22ME028", RegisterNos: []string{
			"7376221ME111", "7376221ME114", "7376221ME138",
		}},

		// S.No 77 - EW 214 - B.E. SE - 22IS006
		{HallNo: "EW 214", CourseCode: "22IS006", RegisterNos: []string{"7376231SE504"}},

		// S.No 78 - EW 214 - 22IS006
		{HallNo: "EW 214", CourseCode: "22IS006", RegisterNos: []string{
			"7376231SE150", "7376231SE153", "7376241SE501",
		}},

		// S.No 79 - EW 214 - B.E. CD - 22OBM01
		{HallNo: "EW 214", CourseCode: "22OBM01", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CD134", "7376231CD135", "7376231CD137")
			r = append(r, expandRange("7376231CD145", "7376231CD147")...)
			r = append(r, expandRange("7376231CD151", "7376231CD155")...)
			r = append(r, "7376231CD161")
			return r
		}()},

		// S.No 80 - EW 214 - B.Tech. IT - 22IT050
		{HallNo: "EW 214", CourseCode: "22IT050", RegisterNos: []string{
			"7376232IT101", "7376232IT127", "7376232IT128", "7376232IT142",
			"7376232IT151", "7376232IT152",
		}},

		// S.No 81 - EW 215 - B.E. ME - 22ME028
		{HallNo: "EW 215", CourseCode: "22ME028", RegisterNos: []string{"7376221ME154"}},

		// S.No 82 - EW 215 - 22ME028
		{HallNo: "EW 215", CourseCode: "22ME028", RegisterNos: []string{
			"7376231ME103", "7376231ME114", "7376231ME119", "7376231ME120",
			"7376231ME123", "7376231ME131", "7376231ME136", "7376231ME139",
			"7376231ME141", "7376231ME143", "7376231ME150", "7376231ME159",
			"7376231ME160", "7376241ME502",
		}},

		// S.No 83 - EW 215 - B.Tech. IT - 22IT050
		{HallNo: "EW 215", CourseCode: "22IT050", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT154")
			r = append(r, expandRange("7376232IT157", "7376232IT159")...)
			r = append(r, "7376232IT166", "7376232IT171", "7376232IT173", "7376232IT175",
				"7376232IT176", "7376232IT180")
			return r
		}()},

		// S.No 84 - EW 218 - B.E. EE - 22OME04
		{HallNo: "EW 218", CourseCode: "22OME04", RegisterNos: []string{
			"7376231EE107", "7376231EE110", "7376231EE112", "7376231EE114",
			"7376231EE116", "7376231EE117", "7376231EE122", "7376231EE125",
		}},

		// S.No 85 - EW 218 - B.E. ME - 22ME028
		{HallNo: "EW 218", CourseCode: "22ME028", RegisterNos: []string{"7376241ME504"}},

		// S.No 86 - EW 218 - B.E. CD - 22CD014
		{HallNo: "EW 218", CourseCode: "22CD014", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CD102")
			r = append(r, expandRange("7376231CD106", "7376231CD108")...)
			r = append(r, expandRange("7376231CD111", "7376231CD114")...)
			r = append(r, "7376231CD118", "7376231CD119", "7376231CD121")
			return r
		}()},

		// S.No 87 - EW 218 - B.Tech. IT - 22IT050
		{HallNo: "EW 218", CourseCode: "22IT050", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT203", "7376232IT209", "7376232IT213", "7376232IT237",
				"7376232IT239", "7376232IT253", "7376232IT256", "7376232IT263",
				"7376232IT264", "7376232IT269", "7376232IT278")
			r = append(r, expandRange("7376232IT283", "7376232IT285")...)
			return r
		}()},

		// S.No 88 - EW 218 - B.Tech. AL - 22OCE02
		{HallNo: "EW 218", CourseCode: "22OCE02", RegisterNos: []string{
			"7376232AL109", "7376232AL115", "7376232AL132", "7376232AL133",
			"7376232AL139", "7376232AL140", "7376232AL159", "7376232AL168",
			"7376232AL185", "7376232AL191", "7376232AL196", "7376232AL197",
			"7376232AL199", "7376232AL201", "7376232AL212", "7376232AL218",
		}},

		// S.No 89 - WW 005 - B.E. CS - 22CS040
		{HallNo: "WW 005", CourseCode: "22CS040", RegisterNos: []string{"7376221CS109"}},

		// S.No 90 - WW 005 - 22CS040
		{HallNo: "WW 005", CourseCode: "22CS040", RegisterNos: []string{
			"7376231CS103", "7376231CS105", "7376231CS111", "7376231CS113", "7376231CS130",
		}},

		// S.No 91 - WW 005 - B.E. EI - 22EI018
		{HallNo: "WW 005", CourseCode: "22EI018", RegisterNos: []string{
			"7376231EI138", "7376231EI139", "7376231EI142", "7376231EI143",
			"7376231EI145", "7376231EI146", "7376231EI148", "7376231EI150",
			"7376231EI151", "7376231EI153",
		}},

		// S.No 92 - WW 005 - B.Tech. IT - 22OBM01
		{HallNo: "WW 005", CourseCode: "22OBM01", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT279", "7376232IT281")...)
			r = append(r, "7376242IT502", "7376242IT503")
			r = append(r, expandRange("7376242IT507", "7376242IT510")...)
			return r
		}()},

		// S.No 93 - WW 006 - B.E. CS - 22CS040
		{HallNo: "WW 006", CourseCode: "22CS040", RegisterNos: []string{
			"7376231CS324", "7376231CS336", "7376231CS337", "7376231CS349", "7376231CS351",
		}},

		// S.No 94 - WW 006 - B.E. BM - 22BM011
		{HallNo: "WW 006", CourseCode: "22BM011", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231BM102", "7376231BM103")
			r = append(r, expandRange("7376231BM105", "7376231BM108")...)
			r = append(r, expandRange("7376231BM112", "7376231BM115")...)
			return r
		}()},

		// S.No 95 - WW 006 - B.Tech. AG - 22AG017
		{HallNo: "WW 006", CourseCode: "22AG017", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AG111", "7376232AG112", "7376232AG114")
			r = append(r, expandRange("7376232AG116", "7376232AG119")...)
			r = append(r, "7376232AG121", "7376232AG122", "7376232AG124")
			return r
		}()},

		// S.No 96 - WW 007 - B.E. BM - 22BM011
		{HallNo: "WW 007", CourseCode: "22BM011", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231BM116")
			r = append(r, expandRange("7376231BM118", "7376231BM120")...)
			r = append(r, "7376231BM122", "7376231BM123", "7376231BM125", "7376231BM126",
				"7376231BM129", "7376231BM130")
			r = append(r, expandRange("7376231BM132", "7376231BM134")...)
			r = append(r, "7376231BM136", "7376231BM137")
			return r
		}()},

		// S.No 97 - WW 007 - B.Tech. AG - 22AG017
		{HallNo: "WW 007", CourseCode: "22AG017", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AG126", "7376232AG127")
			r = append(r, expandRange("7376232AG131", "7376232AG136")...)
			r = append(r, "7376232AG138", "7376232AG139")
			return r
		}()},

		// S.No 98 - WW 008 - B.E. BM - 22BM011
		{HallNo: "WW 008", CourseCode: "22BM011", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231BM138", "7376231BM141")...)
			r = append(r, "7376231BM144")
			r = append(r, expandRange("7376231BM146", "7376231BM151")...)
			return r
		}()},

		// S.No 99 - WW 008 - B.Tech. CT - 22CT040
		{HallNo: "WW 008", CourseCode: "22CT040", RegisterNos: []string{
			"7376232CT101", "7376232CT102", "7376232CT104", "7376232CT107",
		}},

		// S.No 100 - WW 008 - B.Tech. AG - 22AG017
		{HallNo: "WW 008", CourseCode: "22AG017", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AG140", "7376232AG143")
			r = append(r, expandRange("7376232AG145", "7376232AG148")...)
			r = append(r, expandRange("7376232AG150", "7376232AG152")...)
			r = append(r, "7376232AG154")
			return r
		}()},

		// S.No 101 - WW 011 - B.Tech. CB - 22CB028
		{HallNo: "WW 011", CourseCode: "22CB028", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CB127", "7376232CB131", "7376232CB133")
			r = append(r, expandRange("7376232CB135", "7376232CB137")...)
			r = append(r, "7376232CB139", "7376232CB140", "7376232CB142", "7376232CB147")
			return r
		}()},

		// S.No 102 - WW 011 - B.Tech. AD - 22OCE02
		{HallNo: "WW 011", CourseCode: "22OCE02", RegisterNos: []string{
			"7376232AD186", "7376232AD189", "7376232AD193", "7376232AD194",
			"7376232AD202", "7376232AD205", "7376232AD208", "7376232AD213",
			"7376232AD214", "7376232AD220", "7376232AD224", "7376232AD236",
			"7376232AD245", "7376232AD249", "7376232AD252",
		}},

		// S.No 103 - WW 012 - B.E. SE - 22IS006
		{HallNo: "WW 012", CourseCode: "22IS006", RegisterNos: []string{"7376221SE134"}},

		// S.No 104 - WW 012 - B.E. CS - 22OME04
		{HallNo: "WW 012", CourseCode: "22OME04", RegisterNos: []string{"7376231CS149"}},

		// S.No 105 - WW 012 - B.E. SE - 22IS006
		{HallNo: "WW 012", CourseCode: "22IS006", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE102", "7376231SE105")...)
			r = append(r, "7376231SE107", "7376231SE110")
			return r
		}()},

		// S.No 106 - WW 012 - B.Tech. CB - 22CB028
		{HallNo: "WW 012", CourseCode: "22CB028", RegisterNos: []string{
			"7376232CB160", "7376232CB162", "7376232CB163",
		}},

		// S.No 107 - WW 012 - B.Tech. AD - 22OME04
		{HallNo: "WW 012", CourseCode: "22OME04", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD192", "7376232AD198", "7376232AD206", "7376232AD210",
				"7376232AD215", "7376232AD218", "7376232AD226", "7376232AD247")
			r = append(r, "7376242AD502", "7376242AD503")
			r = append(r, expandRange("7376242AD506", "7376242AD508")...)
			r = append(r, "7376242AD510")
			return r
		}()},

		// S.No 108 - WW 113 - B.E. EC - 22OCS01
		{HallNo: "WW 113", CourseCode: "22OCS01", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC201", "7376231EC204", "7376231EC214", "7376231EC216",
				"7376231EC217", "7376231EC220", "7376231EC223")
			r = append(r, expandRange("7376231EC230", "7376231EC234")...)
			r = append(r, "7376231EC239", "7376231EC241", "7376231EC242")
			return r
		}()},

		// S.No 109 - WW 113 - B.Tech. AL - 22AM034
		{HallNo: "WW 113", CourseCode: "22AM034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AL130", "7376232AL131", "7376232AL134", "7376232AL136",
				"7376232AL138")
			r = append(r, expandRange("7376232AL141", "7376232AL145")...)
			return r
		}()},

		// S.No 110 - WW 114 - B.E. EC - 22OCS01
		{HallNo: "WW 114", CourseCode: "22OCS01", RegisterNos: []string{
			"7376231EC277", "7376231EC278", "7376231EC284", "7376231EC286",
			"7376231EC288", "7376231EC292", "7376231EC294", "7376231EC297",
			"7376231EC298", "7376231EC301", "7376231EC307", "7376231EC316",
			"7376231EC324", "7376231EC326", "7376231EC327",
		}},

		// S.No 111 - WW 114 - B.Tech. AL - 22AM034
		{HallNo: "WW 114", CourseCode: "22AM034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AL157", "7376232AL158")
			r = append(r, expandRange("7376232AL160", "7376232AL167")...)
			return r
		}()},

		// S.No 112 - WW 115 - B.Tech. BT - 22BT010
		{HallNo: "WW 115", CourseCode: "22BT010", RegisterNos: expandRange("7376232BT107", "7376232BT121")},

		// S.No 113 - WW 115 - B.Tech. AL - 22AM034
		{HallNo: "WW 115", CourseCode: "22AM034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AL200", "7376232AL203")
			r = append(r, expandRange("7376232AL206", "7376232AL211")...)
			r = append(r, "7376232AL213", "7376232AL214")
			return r
		}()},

		// S.No 114 - WW 117 - B.Tech. BT - 22BT010
		{HallNo: "WW 117", CourseCode: "22BT010", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT142", "7376232BT146")...)
			r = append(r, "7376232BT148", "7376232BT149", "7376232BT151")
			r = append(r, expandRange("7376232BT154", "7376232BT156")...)
			r = append(r, expandRange("7376232BT158", "7376232BT161")...)
			return r
		}()},

		// S.No 115 - WW 117 - B.Tech. AD - 22AI035
		{HallNo: "WW 117", CourseCode: "22AI035", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD101", "7376232AD103")
			r = append(r, expandRange("7376232AD114", "7376232AD119")...)
			return r
		}()},

		// S.No 116 - WW 117 - B.Tech. AL - 22AM034
		{HallNo: "WW 117", CourseCode: "22AM034", RegisterNos: []string{
			"7376242AL506", "7376242AL507",
		}},

		// S.No 117 - WW 118 - B.E. EC - 22OBM01
		{HallNo: "WW 118", CourseCode: "22OBM01", RegisterNos: []string{
			"7376231EC181", "7376231EC182", "7376231EC190", "7376231EC198",
			"7376231EC199", "7376231EC206", "7376231EC210", "7376231EC213",
			"7376231EC218", "7376231EC221", "7376231EC229", "7376231EC236",
			"7376231EC247", "7376231EC248", "7376231EC255",
		}},

		// S.No 118 - WW 118 - B.Tech. AD - 22AI035
		{HallNo: "WW 118", CourseCode: "22AI035", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AD267", "7376232AD272")...)
			r = append(r, "7376232AD274")
			r = append(r, expandRange("7376232AD277", "7376232AD279")...)
			return r
		}()},

		// S.No 119 - WW 218 - B.E. EE - 22OME04
		{HallNo: "WW 218", CourseCode: "22OME04", RegisterNos: []string{
			"7376231EE141", "7376231EE144", "7376231EE146", "7376231EE148",
			"7376231EE156", "7376241EE501",
		}},

		// S.No 120 - WW 218 - B.E. CD - 22CD014
		{HallNo: "WW 218", CourseCode: "22CD014", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CD124", "7376231CD126")...)
			r = append(r, "7376231CD128", "7376231CD129")
			r = append(r, expandRange("7376231CD139", "7376231CD141")...)
			r = append(r, "7376231CD148", "7376231CD149")
			return r
		}()},

		// S.No 121 - WW 218 - B.Tech. CB - 22OBM01
		{HallNo: "WW 218", CourseCode: "22OBM01", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CB108", "7376232CB112", "7376232CB115", "7376232CB117",
				"7376232CB134", "7376232CB141")
			r = append(r, expandRange("7376232CB144", "7376232CB146")...)
			return r
		}()},

		// S.No 122 - WW 219 - B.E. EE - 22OCE02
		{HallNo: "WW 219", CourseCode: "22OCE02", RegisterNos: expandRange("7376231EE102", "7376231EE104")},

		// S.No 123 - WW 219 - B.E. CD - 22CD014
		{HallNo: "WW 219", CourseCode: "22CD014", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CD156", "7376231CD159")...)
			r = append(r, expandRange("7376241CD501", "7376241CD503")...)
			return r
		}()},

		// S.No 124 - WW 219 - B.Tech. CB - 22OBM01
		{HallNo: "WW 219", CourseCode: "22OBM01", RegisterNos: []string{
			"7376232CB148", "7376242CB502", "7376242CB503",
		}},

		// S.No 125 - WW 219 - B.Tech. AL - 22OME04
		{HallNo: "WW 219", CourseCode: "22OME04", RegisterNos: []string{
			"7376232AL111", "7376232AL112", "7376232AL121", "7376232AL122",
			"7376232AL135", "7376232AL137", "7376232AL174", "7376232AL176",
			"7376232AL182", "7376232AL202", "7376232AL204", "7376232AL205",
		}},

		// S.No 126 - WW 222 - B.E. EE - 22OCE02
		{HallNo: "WW 222", CourseCode: "22OCE02", RegisterNos: []string{
			"7376231EE105", "7376231EE106", "7376231EE109", "7376231EE113",
			"7376231EE118", "7376231EE119", "7376231EE121", "7376231EE128",
			"7376231EE129", "7376231EE132", "7376231EE135", "7376231EE137",
			"7376231EE138", "7376231EE140", "7376231EE142", "7376231EE145",
			"7376231EE149", "7376231EE152", "7376231EE154", "7376231EE159",
			"7376231EE161",
		}},

		// S.No 127 - WW 222 - B.E. ME - 22OCE02
		{HallNo: "WW 222", CourseCode: "22OCE02", RegisterNos: []string{
			"7376231ME101", "7376231ME102", "7376231ME107", "7376231ME115",
			"7376231ME121", "7376231ME122", "7376231ME124", "7376231ME129",
			"7376231ME134", "7376231ME135", "7376241ME503",
		}},

		// S.No 128 - WW 222 - B.E. SE - 22OCE02
		{HallNo: "WW 222", CourseCode: "22OCE02", RegisterNos: []string{
			"7376231SE108", "7376231SE111", "7376231SE126",
		}},

		// S.No 129 - WW 222 - 22OME04
		{HallNo: "WW 222", CourseCode: "22OME04", RegisterNos: []string{
			"7376231SE109", "7376231SE115", "7376231SE125", "7376231SE133",
			"7376231SE135", "7376231SE138", "7376231SE140", "7376231SE142",
			"7376231SE148", "7376231SE149", "7376231SE154",
		}},

		// S.No 130 - WW 222 - B.Tech. FT - 22FT028
		{HallNo: "WW 222", CourseCode: "22FT028", RegisterNos: expandRange("7376232FT101", "7376232FT104")},

		// S.No 131 - WW 223 - B.E. EE - 22OCS01
		{HallNo: "WW 223", CourseCode: "22OCS01", RegisterNos: []string{
			"7376231EE111", "7376231EE123", "7376231EE124", "7376231EE126",
			"7376231EE130", "7376231EE133", "7376231EE139", "7376231EE143",
		}},

		// S.No 132 - WW 223 - B.E. SE - 22OCE02
		{HallNo: "WW 223", CourseCode: "22OCE02", RegisterNos: []string{
			"7376231SE127", "7376231SE131", "7376231SE132", "7376231SE137",
			"7376231SE151", "7376231SE155",
		}},

		// S.No 133 - WW 223 - B.Tech. BT - 22OBM01
		{HallNo: "WW 223", CourseCode: "22OBM01", RegisterNos: []string{
			"7376232BT131", "7376232BT165", "7376232BT168", "7376232BT200",
		}},

		// S.No 134 - WW 223 - B.Tech. FT - 22FT028
		{HallNo: "WW 223", CourseCode: "22FT028", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232FT105", "7376232FT106")
			r = append(r, expandRange("7376232FT108", "7376232FT120")...)
			r = append(r, "7376242FT501")
			return r
		}()},

		// S.No 135 - WW 223 - B.Tech. IT - 22OCE02
		{HallNo: "WW 223", CourseCode: "22OCE02", RegisterNos: []string{
			"7376232IT169", "7376232IT181", "7376232IT189", "7376232IT200",
			"7376232IT207", "7376232IT220", "7376232IT230",
		}},

		// S.No 136 - WW 223 - 22OME04
		{HallNo: "WW 223", CourseCode: "22OME04", RegisterNos: []string{
			"7376232IT106", "7376232IT107", "7376232IT113", "7376232IT118",
			"7376232IT124", "7376232IT125", "7376232IT132", "7376232IT147",
			"7376232IT153",
		}},

		// S.No 137 - WW 224 - B.E. CE - 22OBM01
		{HallNo: "WW 224", CourseCode: "22OBM01", RegisterNos: []string{
			"7376231CE111", "7376231CE121", "7376231CE128",
		}},

		// S.No 138 - WW 224 - B.E. CS - 22OCE02
		{HallNo: "WW 224", CourseCode: "22OCE02", RegisterNos: []string{
			"7376231CS129", "7376231CS142", "7376231CS252", "7376231CS315", "7376231CS323",
		}},

		// S.No 139 - WW 224 - B.E. EE - 22OBM01
		{HallNo: "WW 224", CourseCode: "22OBM01", RegisterNos: []string{
			"7376231EE115", "7376231EE120", "7376231EE131", "7376231EE155", "7376231EE160",
		}},

		// S.No 140 - WW 224 - B.E. BM - 22OCS01
		{HallNo: "WW 224", CourseCode: "22OCS01", RegisterNos: []string{
			"7376231BM111", "7376231BM117", "7376231BM121", "7376231BM128",
			"7376231BM131", "7376231BM142",
		}},

		// S.No 141 - WW 224 - B.E. CD - 22OCE02
		{HallNo: "WW 224", CourseCode: "22OCE02", RegisterNos: []string{
			"7376231CD116", "7376231CD127", "7376231CD150", "7376231CD160",
		}},

		// S.No 142 - WW 224 - B.Tech. BT - 22OBM01
		{HallNo: "WW 224", CourseCode: "22OBM01", RegisterNos: []string{
			"7376232BT202", "7376232BT208",
		}},

		// S.No 143 - WW 224 - B.Tech. IT - 22OME04
		{HallNo: "WW 224", CourseCode: "22OME04", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT155", "7376232IT170")
			r = append(r, expandRange("7376232IT182", "7376232IT185")...)
			r = append(r, "7376232IT219", "7376232IT232", "7376232IT234", "7376232IT236",
				"7376232IT259")
			return r
		}()},

		// S.No 144 - WW 224 - B.Tech. AD - 22OBM01
		{HallNo: "WW 224", CourseCode: "22OBM01", RegisterNos: []string{
			"7376232AD150", "7376232AD153", "7376232AD156", "7376232AD185",
			"7376232AD207", "7376232AD216", "7376232AD219", "7376232AD234",
			"7376232AD237", "7376232AD244", "7376232AD254", "7376232AD256",
			"7376232AD276", "7376232AD280",
		}},

		// S.No 145 - WW 225 - B.E. EC - 22OCE02
		{HallNo: "WW 225", CourseCode: "22OCE02", RegisterNos: []string{"7376231EC507"}},

		// S.No 146 - WW 225 - B.E. EI - 22OCE02
		{HallNo: "WW 225", CourseCode: "22OCE02", RegisterNos: []string{
			"7376231EI119", "7376231EI147",
		}},

		// S.No 147 - WW 225 - 22OME04
		{HallNo: "WW 225", CourseCode: "22OME04", RegisterNos: []string{"7376231EI106"}},

		// S.No 148 - WW 225 - B.E. ME - 22OEI01
		{HallNo: "WW 225", CourseCode: "22OEI01", RegisterNos: []string{"7376231ME147"}},

		// S.No 149 - WW 225 - B.E. CD - 22OME04
		{HallNo: "WW 225", CourseCode: "22OME04", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CD105", "7376231CD117", "7376231CD120")
			r = append(r, expandRange("7376231CD131", "7376231CD133")...)
			r = append(r, "7376231CD136", "7376231CD138")
			r = append(r, expandRange("7376231CD142", "7376231CD144")...)
			return r
		}()},

		// S.No 150 - WW 225 - B.E. MZ - 22OME04
		{HallNo: "WW 225", CourseCode: "22OME04", RegisterNos: []string{
			"7376231MZ110", "7376231MZ114", "7376231MZ117", "7376231MZ120",
			"7376231MZ121", "7376231MZ128", "7376231MZ129", "7376231MZ131",
			"7376231MZ135", "7376231MZ139", "7376231MZ143", "7376231MZ144",
			"7376231MZ150", "7376231MZ156", "7376241MZ502",
		}},

		// S.No 151 - WW 225 - B.Tech. BT - 22BT040
		{HallNo: "WW 225", CourseCode: "22BT040", RegisterNos: []string{
			"7376232BT101", "7376232BT124", "7376232BT134", "7376232BT138",
			"7376232BT147", "7376232BT152", "7376232BT153", "7376232BT162",
			"7376232BT163", "7376232BT173", "7376232BT176", "7376232BT199",
			"7376232BT204",
		}},

		// S.No 152 - WW 225 - B.Tech. BT - 22OCE02
		{HallNo: "WW 225", CourseCode: "22OCE02", RegisterNos: []string{"7376232BT105"}},

		// S.No 153 - WW 225 - 22OCS01
		{HallNo: "WW 225", CourseCode: "22OCS01", RegisterNos: []string{
			"7376232BT103", "7376232BT157",
		}},

		// S.No 154 - WW 225 - B.Tech. CB - 22OME04
		{HallNo: "WW 225", CourseCode: "22OME04", RegisterNos: []string{"7376232CB123"}},

		// S.No 155 - WW 225 - B.Tech. AD - 22OBM01
		{HallNo: "WW 225", CourseCode: "22OBM01", RegisterNos: []string{
			"7376232AD285", "7376242AD505",
		}},

		// S.No 156 - WW 226 - B.Tech. CB - 22OCE02
		{HallNo: "WW 226", CourseCode: "22OCE02", RegisterNos: []string{
			"7376232CB501", "7376232CB504",
		}},

		// S.No 157 - WW 226 - B.E. CS - 22OBM01
		{HallNo: "WW 226", CourseCode: "22OBM01", RegisterNos: []string{
			"7376231CS123", "7376231CS163", "7376231CS180", "7376231CS184",
			"7376231CS220", "7376231CS254", "7376231CS271", "7376231CS294",
			"7376231CS348",
		}},

		// S.No 158 - WW 226 - B.E. BM - 22OME04
		{HallNo: "WW 226", CourseCode: "22OME04", RegisterNos: []string{"7376231BM101"}},

		// S.No 159 - WW 226 - B.E. CD - 22OME04
		{HallNo: "WW 226", CourseCode: "22OME04", RegisterNos: []string{"7376231CD162"}},

		// S.No 160 - WW 226 - B.E. MZ - 22OCS01
		{HallNo: "WW 226", CourseCode: "22OCS01", RegisterNos: []string{
			"7376231MZ103", "7376231MZ109", "7376231MZ116", "7376231MZ118",
			"7376231MZ123", "7376231MZ127", "7376231MZ130", "7376231MZ134",
			"7376231MZ140", "7376231MZ147", "7376231MZ157",
		}},

		// S.No 161 - WW 226 - B.Tech. CB - 22OCE02
		{HallNo: "WW 226", CourseCode: "22OCE02", RegisterNos: []string{
			"7376232CB107", "7376232CB110", "7376232CB113", "7376232CB128",
			"7376232CB130", "7376232CB132", "7376232CB161",
		}},

		// S.No 162 - WW 226 - B.Tech. CT - 22OBM01
		{HallNo: "WW 226", CourseCode: "22OBM01", RegisterNos: []string{
			"7376232CT103", "7376232CT111", "7376232CT113", "7376232CT115",
			"7376232CT121", "7376232CT123", "7376232CT138", "7376232CT140",
			"7376232CT145", "7376232CT147", "7376232CT159",
		}},

		// S.No 163 - WW 226 - B.Tech. CT - 22OME04
		{HallNo: "WW 226", CourseCode: "22OME04", RegisterNos: []string{
			"7376232CT105", "7376232CT117", "7376232CT125", "7376232CT133",
			"7376232CT136", "7376232CT144", "7376232CT162", "7376242CT502",
		}},

		// S.No 164 - WW 227 - B.E. CS - 22OEI01
		{HallNo: "WW 227", CourseCode: "22OEI01", RegisterNos: []string{"7376221CS229"}},

		// S.No 165 - WW 227 - B.E. EC - 22OEI01
		{HallNo: "WW 227", CourseCode: "22OEI01", RegisterNos: []string{
			"7376231EC109", "7376231EC114", "7376231EC157", "7376231EC170",
			"7376231EC185", "7376231EC300",
		}},

		// S.No 166 - WW 227 - B.E. EI - 22OCS01
		{HallNo: "WW 227", CourseCode: "22OCS01", RegisterNos: []string{
			"7376231EI101", "7376231EI112", "7376231EI126", "7376231EI134",
		}},

		// S.No 167 - WW 227 - B.E. ME - 22OCS01
		{HallNo: "WW 227", CourseCode: "22OCS01", RegisterNos: []string{
			"7376231ME108", "7376231ME118",
		}},

		// S.No 168 - WW 227 - B.E. BM - 22OME04
		{HallNo: "WW 227", CourseCode: "22OME04", RegisterNos: []string{
			"7376231BM104", "7376231BM109", "7376231BM110", "7376231BM127",
			"7376231BM135", "7376231BM145",
		}},

		// S.No 169 - WW 227 - B.E. SE - 22OBM01
		{HallNo: "WW 227", CourseCode: "22OBM01", RegisterNos: []string{
			"7376231SE101", "7376231SE120", "7376231SE130", "7376231SE147", "7376231SE152",
		}},

		// S.No 170 - WW 227 - B.E. MZ - 22OCE02
		{HallNo: "WW 227", CourseCode: "22OCE02", RegisterNos: []string{"7376231MZ141"}},

		// S.No 171 - WW 227 - 22OEI01
		{HallNo: "WW 227", CourseCode: "22OEI01", RegisterNos: []string{
			"7376231MZ112", "7376231MZ125", "7376231MZ149",
		}},

		// S.No 172 - WW 227 - B.Tech. BT - 22OME04
		{HallNo: "WW 227", CourseCode: "22OME04", RegisterNos: []string{"7376232BT177"}},

		// S.No 173 - WW 227 - B.Tech. CT - 22OCE02
		{HallNo: "WW 227", CourseCode: "22OCE02", RegisterNos: []string{
			"7376232CT109", "7376232CT120", "7376232CT135", "7376232CT139", "7376232CT142",
		}},

		// S.No 174 - WW 227 - B.Tech. AL - 22OBM01
		{HallNo: "WW 227", CourseCode: "22OBM01", RegisterNos: []string{
			"7376232AL105", "7376232AL108", "7376232AL118", "7376232AL175",
			"7376232AL188", "7376232AL219",
		}},

		// S.No 175 - WW 227 - B.Tech. AL - 22OEI01
		{HallNo: "WW 227", CourseCode: "22OEI01", RegisterNos: []string{"7376232AL150"}},

		// S.No 176 - WW 227 - B.Tech. AG - 22OCS01
		{HallNo: "WW 227", CourseCode: "22OCS01", RegisterNos: []string{
			"7376232AG106", "7376232AG129",
		}},
	}
}

func buildSeatingData10AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. CE - 22CE013
		{HallNo: "EW 101", CourseCode: "22CE013", RegisterNos: []string{"7376221CE124"}},

		// S.No 2 - EW 101 - B.E. CS - 22CS030
		{HallNo: "EW 101", CourseCode: "22CS030", RegisterNos: []string{"7376221CS196"}},

		// S.No 3 - EW 101 - B.E. EC - 22EC026
		{HallNo: "EW 101", CourseCode: "22EC026", RegisterNos: []string{
			"7376221EC192", "7376221EC226",
		}},

		// S.No 4 - EW 101 - B.Tech. FD - 22FD038
		{HallNo: "EW 101", CourseCode: "22FD038", RegisterNos: []string{
			"7376222FD107", "7376222FD116", "7376222FD121", "7376222FD125",
		}},

		// S.No 5 - EW 101 - B.Tech. AD - 22AI037
		{HallNo: "EW 101", CourseCode: "22AI037", RegisterNos: []string{"7376232AD502"}},

		// S.No 6 - EW 101 - B.Tech. AG - 22AG044
		{HallNo: "EW 101", CourseCode: "22AG044", RegisterNos: []string{
			"7376222AG120", "7376222AG158",
		}},

		// S.No 7 - EW 101 - B.E. CE - 22CE013
		{HallNo: "EW 101", CourseCode: "22CE013", RegisterNos: []string{
			"7376231CE117", "7376231CE120", "7376241CE501",
		}},

		// S.No 8 - EW 101 - B.E. CS - 22CS030
		{HallNo: "EW 101", CourseCode: "22CS030", RegisterNos: []string{"7376241CS504"}},

		// S.No 9 - EW 101 - B.Tech. AD - 22AI037
		{HallNo: "EW 101", CourseCode: "22AI037", RegisterNos: []string{
			"7376232AD115", "7376232AD228", "7376232AD250",
		}},
	}
}

// LookupHall returns the hall number for a given register number and course code.
func LookupHall(registerNo, courseCode string) (string, bool) {
	registerNo = strings.TrimSpace(strings.ToUpper(registerNo))
	courseCode = strings.TrimSpace(strings.ToUpper(courseCode))

	allRecords := append(buildSeatingData23AN(), buildSeatingData23FN()...)
	allRecords = append(allRecords, buildSeatingData18FN()...)
	allRecords = append(allRecords, buildSeatingData18AN()...)
	allRecords = append(allRecords, buildSeatingData19FN()...)
	allRecords = append(allRecords, buildSeatingData19AN()...)
	allRecords = append(allRecords, buildSeatingData20FN()...)
	allRecords = append(allRecords, buildSeatingData06AN()...)
	allRecords = append(allRecords, buildSeatingData07FN()...)
	allRecords = append(allRecords, buildSeatingData08AN()...)
	allRecords = append(allRecords, buildSeatingData09FN()...)
	allRecords = append(allRecords, buildSeatingData10AN()...)
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
