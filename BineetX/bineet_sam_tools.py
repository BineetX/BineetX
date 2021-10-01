import pysam
samfile = pysam.AlignmentFile("/home/bineet/Workspace/ROUGH/bwa.sam","r")
file_path = "/home/bineet/Workspace/ROUGH/bwa.sam"

class SamFile:
    def __init__(self,samfile,raw_file):
        self.samfile = samfile
        self.raw_file = raw_file

    def OK_lets_see(self):
        from subprocess import Popen, PIPE
        stdout = Popen('cat {} | head'.format(self.raw_file), shell=True, stdout=PIPE).stdout
        output = stdout.read().decode("utf-8")
        print(output)
        
    def lets_see(self,numer_of_lines =5):
        count = 0
        reads = self.samfile.fetch()
        for read in reads:
            print(str(read))
            count = count + 1
            if count == numer_of_lines:
                break
            else:
                pass
    def Analyze(self):
        import re
        from subprocess import Popen, PIPE
        reads = self.samfile.fetch()
        fet = ""
        for read in reads:
            fet = str(read)
            break
        parts = re.split("\t",fet)


        # COLUMN 1 : Q NAME
        print("THE NAME OF THE ALIGNED QUERY SEQUENCE\n\t:{}".format(parts[0]))

        # COLUMN 2 : FLAGS

        flag = parts[1]
        stdout = Popen('samtools flags {}'.format(flag), shell=True, stdout=PIPE).stdout
        output = stdout.read().decode("utf-8")
        flag_parts = output.split("\t")
        print("\nFLAG : {}\n\t:{}".format(flag,flag_parts[2]))

        # COLUMN 3 : 
        #Reference Name 
        print("references:")
        last = parts[11]
        print(last)




        

file = SamFile(samfile,file_path)
file.Analyze()