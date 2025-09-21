#ifndef SYSCALLS_H
#define SYSCALLS_H

/* YOU SHOULD NOT NEED TO EDIT THIS FILE, BUT YOU CAN IF YOU WANT */
#include <dirent.h>        /* for struct dirent */
#include <time.h>          /* for struct timespec */
#include <sys/socket.h>    /* for socklen_t and sockaddr */
#include <stdio.h>         /* for FILE type */
#include <netdb.h>         /* for hostent struct */

/* you must submit wrapped functions for all these prototypes */
//struct hostent *Gethostbyname(const char *name)
void *Realloc(void *ptr, size_t size);
int Connect(int socket, const struct sockaddr *address, socklen_t address_len);
ssize_t Recv(int socket, void *buffer, size_t length, int flags);
ssize_t Send(int socket, const void *buffer, size_t length, int flags);
int Socket(int domain, int type, int protocol);
int Bind(int socket, const struct sockaddr *address, socklen_t address_len);
int Listen(int socket, int backlog);
int Accept(int socket, struct sockaddr *restrict address, socklen_t *restrict address_len);
int Socketpair(int domain, int type, int protocol, int socket_vector[2]);
pid_t Wait(int *wstatus);
int Pipe(int fildes[2]);
int Nanosleep(const struct timespec *req, struct timespec *rem);
pid_t Fork(void);
void *Malloc(size_t size);
ssize_t Read(int fildes, void *buf, size_t nbyte);
ssize_t Write(int fildes, const void *buf, size_t nbyte);
int Close(int fildes);  /* ok to have this not return anything */
int Chdir(const char *path);
struct dirent *Readdir(DIR *dirp);
DIR *Opendir(const char *name);
int Closedir(DIR *dirp);  /* ok to have this not return anything */
FILE *Fopen(const char *path, const char *mode);
void Fclose(FILE *fp);  /* ok to have this return int */
int Fseek(FILE *fp, long offset, int whence);
long Ftell(FILE *fp);
size_t Fread(void *ptr, size_t item_size, size_t num_items, FILE *fp);
size_t Fwrite(const void *ptr, size_t item_size, size_t num_items, FILE *fp); 

#endif
