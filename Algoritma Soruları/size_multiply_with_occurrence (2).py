'''
Problem:
t and z are strings consist of lowercase English letters.

Find all substrings for t, and return the maximum value of [ len(substring) x [how many times the substring occurs in z] ]

Example:
t = acldm1labcdhsnd
z = shabcdacasklksjabcdfueuabcdfhsndsabcdmdabcdfa

Solution:
abcd is a substring of t, and it occurs 5 times in Z, len(abcd) x 5 = 20 is the solution

'''
def find_substrings(s):
     substrings = set()
     for i in range(len(s)):
         for j in range(i+1, len(s)+1):
             substrings.add(s[i:j])
     return substrings

def find_max(t,z):
   
    # Generate all substrings of t
    substrings_t = find_substrings(t)
    
    # Initialize the maximum product value
    max_product = 0
    
    # For each substring, find its occurrence in z and calculate the product
    for substring in substrings_t:
        occurrences = z.count(substring)
        product = len(substring) * occurrences
        max_product = max(max_product, product)
    
    return max_product


if __name__ == '__main__':
    find_max("acldm1labcdhsnd","shabcdacasklksjabcdfueuabcdfhsndsabcdmdabcdfa")