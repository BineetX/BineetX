#THIS CODE REPOSIRATORY WAS DEVELOPPED BY BINEET KUMAR MOHANTA AT ILS
#FILE OPENING SECTION


#For a small file 
def FileOpen(filepath):
    handler = open(filepath)
    data = handler.read()
    return data

#For a moderate file whithout giving much pressure to the computer
def OpenHugeFile(filepath):
    with open(data5) as handler:
        for line in handler:
            print(line)

#For opening first some lines of a VERY HUGE file for analysis
#def SomeLineOpener(filepath, number_of_lines):



#Analyze the first lines and its columns

def AnalyzeFirstLine(string,delimiter):
    import re 
    parts = re.split(delimiter,string)
    for part in parts:
        print(part)





#Open Number of Lines  in a large file
def OpenNumbersOfLines(handler,number_of_lines):
    count = 0
    line_count =0
    first_line = ""
    while count < number_of_lines:
        line = handler.readline()
        print(line)
        if count == 0:
            first_line = line
        count = count + 1


#Read tar.gz files
def ReadTarFile(file_path):
    import tarfile
    import bineet_file_analyzer

    tar = tarfile.open(file_path, "r:gz")
    for member in tar.getmembers():
        f = tar.extractfile(member)
        if f is not None:
            bineet_file_analyzer.OpenNumbersOfLines(f,1)

#Huge OBO files Analysis


#BAM file ananlysis

