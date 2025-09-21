#ifndef TEAM_H
#define TEAM_H

// void new_password(user_t *u);
// int read_users(user_t *user_list, char* filename);
// int save_users(user_t *user_list, char* username, char* password=NULL, int size);


// enum ACCESS{USER, ADMIN};
struct Team
{
    char *teammate1;
    char *teammate2;
    char *teammate3;
    char *teammate4;
    char *teammate5;
    char *enemy1;
    char *enemy2;
    char *enemy3;
    char *enemy4;
    char *enemy5;
    bool team1Win;
}
typedef Team team_t;

#endif