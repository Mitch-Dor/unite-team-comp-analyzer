#include <stdio.h>       /* for fprintf and fopen and fclose and fread and fwrite and fseek and ftell */
#include <stdlib.h>      /* for exit and malloc and realloc */
#include <errno.h>       /* for errno */
#include <string.h>      /* for strerror */
#include <unistd.h>      /* for chdir and pipe and fork and close and read and write */
#include <dirent.h>      /* for readdir and opendir and closedir */
#include <time.h>        /* for nanosleep */
#include <sys/types.h>   /* for opendir and closedir */
#include <sys/socket.h>  /* for socketpair and connect and recv and send and socket and listen and socket */
#include <sys/wait.h>    /* for wait */
#include <netdb.h>       /* for gethostbyname and hostent */

void *Realloc(void *ptr, size_t size){
  void *returnPtr;
  if ((returnPtr = realloc(ptr, size)) == NULL) {
    fprintf(stderr, "Could not allocate space - %s", strerror(errno));
    exit(errno);
  }
  return returnPtr;
}



int Connect(int socket, const struct sockaddr *address, socklen_t address_len){
  int checkVal = connect(socket, address, address_len);
  if(checkVal==-1){
    fprintf(stderr, "connect error - %s\n", strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno); 
  }
  return 0;
}

ssize_t Recv(int socket, void *buffer, size_t length, int flags){
  ssize_t returnVal = recv(socket, buffer, length, flags);
  if(returnVal==-1){
    fprintf(stderr, "recv error - %s\n", strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno); 
  }
  return returnVal;
}

ssize_t Send(int socket, const void *buffer, size_t length, int flags){
  ssize_t returnVal = send(socket, buffer, length, flags);
  if(returnVal==-1){
    fprintf(stderr, "send error - %s\n", strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno); 
  }
  return returnVal;
}

int Socket(int domain, int type, int protocol){
  int returnVal = socket(domain, type, protocol);
  if(returnVal == -1){
    fprintf(stderr, "socket error - %s\n", strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno); 
  }
  return returnVal;
}

int Bind(int socket, const struct sockaddr *address, socklen_t address_len){
  int returnVal = bind(socket, address, address_len);
  if(returnVal==-1){
    fprintf(stderr, "bind error - %s\n", strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno);
  }
  return 0;
}

int Listen(int socket, int backlog){
  int returnVal = listen(socket, backlog);
  if(returnVal == -1){
    fprintf(stderr, "listen error - %s\n", strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno);
  }
  return 0;
}

int Accept(int socket, struct sockaddr *restrict address, socklen_t *restrict address_len){
  int returnVal = accept(socket, address, address_len);
  if(returnVal==-1){
    fprintf(stderr, "accept error - %s\n", strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno);
  }
  return returnVal;
}

int Socketpair(int domain, int type, int protocol, int socket_vector[2]){
  int returnValue = socketpair(domain, type, protocol, socket_vector);
  if(returnValue == -1){
    fprintf(stderr, "socketpair error - %s\n", strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno); 
  }
  return 0;
}

pid_t Wait(int *stat_loc){
  pid_t returnValue = wait(stat_loc);
  if (returnValue == 0 || returnValue == -1){
    fprintf(stderr, "wait error - %s\n", strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno); 
  }
  return returnValue;
}

int Pipe(int fildes[2]){
  int returnValue = pipe(fildes);
  if(returnValue==-1){
    fprintf(stderr, "pipe error - %s\n", strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno); 
  }
  return 0;
}

int Nanosleep(const struct timespec *req, struct timespec *rem){
  int returnValue = nanosleep(req, rem);
  if(returnValue==-1){
    fprintf(stderr, "nanosleep error - %s\n", strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno); 
  }
  return 0;
}

pid_t Fork(void) {
  pid_t pid;
  if ((pid = fork()) < 0) {
    fprintf(stderr, "fork failed - %s\n", strerror(errno));
    exit(errno);
  }
  return pid;
}

int Close(int fildes){
  int returnValue = close(fildes);
  if (returnValue==-1) {
    fprintf(stderr, "Close error - %s\n", strerror(errno));
    exit(errno);
  }
  return returnValue;
}

/* Read and Write are below */

int Chdir(const char *path) {                                          /* error checking/handling wrapper around chdir system call */
  if (chdir(path)) {  /* error if -1, 0 upon success */
    fprintf(stderr, "chdir error (%s) - %s\n", path, strerror(errno));  /* use errno global variable to retrieve error message */
    exit(errno);                                                       /* exit with the errno global variable value */
  }
  return 0;                                                            /* if no error, return 0 (which is what chdir returned) */
}

struct dirent *Readdir(DIR *dirp) {
  errno = 0;  /* clear so an error condition can be detected */
  struct dirent *filep = NULL;
  if (!(filep = readdir(dirp)) && errno) {  /* error if NULL is returned AND errno is nonzero */
    fprintf(stderr, "readdir error - %s\n", strerror(errno));
    exit(errno);
  }
  return filep;
}

DIR *Opendir(const char *name) {
  DIR *dirp = NULL;
  if (!(dirp = opendir(name))) {  /* error if NULL is returned */
    fprintf(stderr, "opendir error (%s) - %s\n", name, strerror(errno));
    exit(errno);
  }
  return dirp;
}

int Closedir(DIR *dirp) {
  if (closedir(dirp)) {  /* error if -1, 0 upon success */
    fprintf(stderr, "closedir error - %s\n", strerror(errno));
    exit(errno);
  }
  return 0;
}

ssize_t Read(int fildes, void *buffer, size_t nbytes) {
  ssize_t numBytes;
  if ((numBytes = read(fildes, buffer, nbytes)) == -1) {
    fprintf(stderr, "read error on descriptor %d - %s\n", fildes, strerror(errno));
    exit(errno);
  }
  return numBytes;
}

ssize_t Write(int fildes, const void *buffer, size_t nbytes) {
  ssize_t numBytes;
  if ((numBytes = write(fildes, buffer, nbytes)) == -1) {
    fprintf(stderr, "Write error on descriptor %d - %s", fildes, strerror(errno));
    exit(errno);
  }
  return numBytes;
}

void *Malloc(size_t size) {
  void *ptr;
  if ((ptr = malloc(size)) == NULL) {
    fprintf(stderr, "Could not allocate space - %s", strerror(errno));
    exit(errno);
  }
  return ptr;
}

FILE *Fopen(const char *path, const char *mode) {     /* same as in prog0 */
  FILE *fp = NULL;
  if ((fp = fopen(path, mode)) == NULL) {
    fprintf(stderr, "Unable to open %s with mode %s - %s", path, mode, strerror(errno));
    exit(errno);
  }
  return fp;
}

void Fclose(FILE *fp) {     /* same as in prog1 */
  if (fp && fclose(fp)) {
    fprintf(stderr, "Unable to close file descriptor %d - %s", fileno(fp), strerror(errno));
    exit(errno);
  }
}

int Fseek(FILE *fp, long offset, int whence) {
  int newOffset;
  if ((newOffset = fseek(fp, offset, whence)) == -1) {
    fprintf(stderr, "Unable to seek using offset %ld with whence %d - %s", offset, whence, strerror(errno));
    exit(errno);
  }
  return newOffset;
}

long Ftell(FILE *fp) {
  long offset;
  if ((offset = ftell(fp)) == -1) {
    fprintf(stderr, "Unable to obtain position using ftell - %s", strerror(errno));
    exit(errno);
  }
  return offset;
}

size_t Fread(void *ptr, size_t item_size, size_t num_items, FILE *fp) {
  size_t items_read = 0;
  /* The function fread() reads num_items of data, each item_size bytes long, from the stream pointed to by fp and storing them at ptr */
  if ((items_read = fread(ptr, item_size, num_items, fp)) == 0)        /* getting 0 may not be an error */
    if (!feof(fp) && ferror(fp)) {   /* this means we did not reach EOF but encountered an error */
      fprintf(stderr, "Encountered error while reading from file descriptor %d - %s", fileno(fp), strerror(errno));
      exit(errno);
    }
  return items_read;
}

size_t Fwrite(const void *ptr, size_t item_size, size_t num_items, FILE *fp) {
  size_t items_written = 0;
  /* The function fwrite() writes num_items of data, each item_size bytes long, from the stream pointed to by fp and storing them at ptr */
  if ((items_written = fwrite(ptr, item_size, num_items, fp)) == 0)    /* only if no items are written do we check for error */
    if (ferror(fp)) {
      fprintf(stderr, "Encountered error while writing to file descriptor %d - %s", fileno(fp), strerror(errno));
      exit(errno);
    }
  return items_written;
}