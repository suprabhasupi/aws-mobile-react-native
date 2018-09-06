import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export const ListAllNotes = gql`query ListAllNotes {
    allNote {
        noteId, title
    }
}`;

export const GetNote = gql`query GetNote($noteId:ID!) {
    getNote(noteId:$noteId) {
        noteId, title, content
    }
}`;

export const SaveNote = gql`mutation SaveNote($noteId:ID!,$title:String!,$content:String!) {
    putNote(noteId:$noteId, title:$title, content:$content) {
        noteId, title, content
    }
}`;

export const DeleteNote = gql`mutation DeleteNote($noteId:ID!) {
    deleteNote(noteId:$noteId) {
        noteId
    }
}`;

export const operations = {
    ListAllNotes: graphql(ListAllNotes, {
        options: {
            // fetchPolicy: 'network-only'
            fetchPolicy: 'cache-first'
        },
        props: ({ data }) => {
            return {
                loading: data.loading,
                notes: data.allNote
            };
        }
    }),

     GetNote: graphql(GetNote, {
        options: props => {
            return {
                fetchPolicy: 'cache-first',
                variables: { noteId: props.navigation.state.params.noteId }
            };
        },
        props: ({ data }) => {
            return {
                loading: data.loading,
                note: data.getNote
            }
        }
    }),

    DeleteNote: graphql(DeleteNote, {
        options: {
            refetchQueries: [ { query: ListAllNotes } ]
        },
        props: props => ({
            deleteNote: (noteId) => {
                return props.mutate({
                    variables: {noteId},
                    optimisticResponse: {
                        deleteNote: { noteId, __typename: 'Note' }
                    }
                })
            }
        })
    }),

    SaveNote: graphql(SaveNote, {
        options: {
            refetchQueries: [ { query: ListAllNotes } ]
        },
        props: props => ({
            saveNote: (note) => {
                return props.mutate({
                    variables: note,
                    optimisticResponse: {
                        putNote: { ...note, __typename: 'Note' }
                    }
                })
            }
        })
    })
};
