score_dict = {"!":0,'"':1,"#":2,"$":3,"%":4,"&":5,"'":6,"(":7,")":8,"*":9,"+":10,",":11,"-":12,".":13,"/":14,"0":15,"1":16,"2":17,"3":18,"4":19,"5":20,"6":21,"7":22,"8":23,"9":24,":":25,";":26,"<":27,"=":28,">":29,"?":30,"@":31,"A":32,"B":33,"C":34,"D":35,"E":36,"F":37,"G":38,"H":39,"I":40}
from _typeshed import StrPath
from math import *
def fastQ_score(code):
	print(score_dict[code])

def ErrorProbability(code):
	val = score_dict[code]
	error = 10**-(val/10)
	return error
	
def CorrespondingValue(code):
	val = score_dict[code]
	co_val = val + 33
	return co_val
	
