'''
You have a text that some of the words in reverse order.
The text also contains some words in the correct order, and they are wrapped in parenthesis.
Write a function fixes all of the words and,
remove the parenthesis that is used for marking the correct words.

Your function should return the same text defined in the constant CORRECT_ANSWER
'''


INPUT = ("nhoJ (Griffith) nodnoL saw (an) (American) ,tsilevon "
         ",tsilanruoj (and) laicos .tsivitca ((A) reenoip (of) laicremmoc "
         "noitcif (and) naciremA ,senizagam (he) saw eno (of) (the) tsrif "
         "(American) srohtua (to) emoceb (an) lanoitanretni ytirbelec "
         "(and) nrae a egral enutrof (from) ).gnitirw")

CORRECT_ANSWER = "John Griffith London was an American novelist, journalist, and social activist. (A pioneer of commercial fiction and American magazines, he was one of the first American authors to become an international celebrity and earn a large fortune from writing.)"

def fix_text(mystr):
    # Split the input text by space to process each word
    words = mystr.split(" ")
    corrected_words = []

    # Iterate over each word to check and correct if needed
    for word in words:
        # Check if the word is wrapped in parenthesis indicating it's correct
        if word.startswith("(") and word.endswith(")"):
            # Remove the parentheses and add the word to the corrected list
            corrected_words.append(word[1:-1])
        else:
            # Reverse the word and remove any surrounding parentheses before adding
            corrected_word = word[::-1]
            if corrected_word.startswith("(") and corrected_word.endswith(")"):
                corrected_word = corrected_word[1:-1]
            corrected_words.append(corrected_word)

    # Join the corrected words back into a string
    corrected_text = " ".join(corrected_words)
    
    # Remove extra spaces before punctuation
    corrected_text = corrected_text.replace(" ,", ",").replace(" .", ".").replace(" )", ")").replace("( ", "(")
    
    return corrected_text


if __name__ == "__main__":
    print("Correct!" if fix_text(INPUT) == CORRECT_ANSWER else "Sorry, it does not match with the correct answer.")
