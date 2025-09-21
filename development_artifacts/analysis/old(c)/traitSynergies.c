// The easiest way is probably to just count the number of times each combination of traits wins... But this can become large very quickly.
// Hence why I'm doing this in C.
#include "synergyFuncs.h"
#include "syscalls.h"
#include "team.h"

int main(){
    // Step 1: Read in all team comps and whether they won or lost from a file
    team_t *team_list = NULL;
    readComps(team_list);
    // Step 2: Run an analysis to see if there are common groups of Pokemon winning together, as well as if there are common groups of Pokemon being picked together
        // Note: May want to do some special for the really common picks that are just being picked regardless
        // This analysis should probably run just based on Pokemon first.
        // Then, we may want to take these groups of Pokemon and see if we can find groups of traits in common from that to make it easier to search.
    
    // Step 3 (Maybe not in the same run): Run an analysis to see if a certain set of synergies is beating another certain set of synergies often

}